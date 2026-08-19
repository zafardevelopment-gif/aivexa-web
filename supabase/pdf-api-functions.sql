-- ============================================================
-- AIVEXA PDF API — Supabase Functions
-- Run AFTER pdf-api-schema.sql
-- ============================================================

-- Atomic credit increment (avoids race conditions)
create or replace function public.pdfapi_increment_credits(p_user_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.pdfapi_users
  set
    credits_used = credits_used + 1,
    updated_at   = now()
  where id = p_user_id;
end;
$$;

-- Reset credits at start of each billing period
-- Call this via a Supabase Edge Function cron or pg_cron
create or replace function public.pdfapi_reset_monthly_credits()
returns void language plpgsql security definer as $$
begin
  update public.pdfapi_users
  set
    credits_used     = 0,
    credits_reset_at = date_trunc('month', now()) + interval '1 month',
    updated_at       = now()
  where credits_reset_at <= now();
end;
$$;

-- Get dashboard summary for a user
create or replace function public.pdfapi_user_summary(p_user_id uuid)
returns table (
  plan_name       text,
  credits         int,
  credits_used    int,
  credits_pct     numeric,
  requests_today  bigint,
  requests_month  bigint,
  success_rate    numeric
) language plpgsql security definer as $$
declare
  v_plan_id   text;
  v_credits   int;
  v_used      int;
begin
  select u.plan_id, p.credits, u.credits_used
  into v_plan_id, v_credits, v_used
  from public.pdfapi_users u
  join public.pdfapi_plans p on p.id = u.plan_id
  where u.id = p_user_id;

  return query
  select
    v_plan_id::text,
    v_credits,
    v_used,
    case when v_credits > 0 then round((v_used::numeric / v_credits) * 100, 1) else 0 end,
    count(*) filter (where created_at >= current_date),
    count(*) filter (where created_at >= date_trunc('month', current_date)),
    case when count(*) > 0
      then round(count(*) filter (where status = 'completed')::numeric / count(*) * 100, 1)
      else 100
    end
  from public.pdfapi_requests
  where user_id = p_user_id;
end;
$$;
