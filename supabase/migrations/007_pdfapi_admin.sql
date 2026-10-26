-- ============================================================
-- AIVEXA PDF API — admin user list (007)
-- Called only by the server with the service-role key.
-- ============================================================
drop function if exists public.pdfapi_admin_user_list(text, int, int);
create or replace function public.pdfapi_admin_user_list(p_search text, p_limit int, p_offset int)
returns table (
  id uuid, email text, plan_id text, plan_name text, credits int, credits_used int,
  plan_expires_at timestamptz, is_active boolean, created_at timestamptz,
  last_sign_in_at timestamptz, email_confirmed boolean,
  requests_30d bigint, failed_30d bigint, last_request_at timestamptz,
  paid_total bigint, last_paid_at timestamptz, last_paid_amount int, autopay_on boolean, total_count bigint
) language sql security definer set search_path = public as $$
  with base as (
    select u.*, p.name as p_name, p.credits as p_credits
    from public.pdfapi_users u
    join public.pdfapi_plans p on p.id = u.plan_id
    where coalesce(p_search, '') = '' or u.email ilike '%' || p_search || '%'
  )
  select b.id, b.email, b.plan_id, b.p_name, b.p_credits, b.credits_used,
         b.plan_expires_at, b.is_active, b.created_at,
         au.last_sign_in_at, au.email_confirmed_at is not null,
         (select count(*) from public.pdfapi_requests r where r.user_id = b.id and r.created_at > now() - interval '30 days'),
         (select count(*) from public.pdfapi_requests r where r.user_id = b.id and r.created_at > now() - interval '30 days' and r.status = 'failed'),
         (select max(r.created_at) from public.pdfapi_requests r where r.user_id = b.id),
         (select coalesce(sum(o.amount), 0) from public.pdfapi_payment_orders o where o.user_id = b.id and o.status = 'paid'),
         (select max(o.paid_at) from public.pdfapi_payment_orders o where o.user_id = b.id and o.status = 'paid'),
         (select o.amount from public.pdfapi_payment_orders o where o.user_id = b.id and o.status = 'paid' order by o.paid_at desc nulls last limit 1),
         exists (select 1 from public.pdfapi_subscriptions s where s.user_id = b.id and s.status in ('active','authenticated','pending') and not s.cancel_at_cycle_end),
         count(*) over ()
  from base b
  left join auth.users au on au.id = b.id
  order by coalesce((select max(r.created_at) from public.pdfapi_requests r where r.user_id = b.id), b.created_at) desc
  limit greatest(p_limit, 1) offset greatest(p_offset, 0);
$$;
revoke all on function public.pdfapi_admin_user_list(text, int, int) from public, anon, authenticated;
grant execute on function public.pdfapi_admin_user_list(text, int, int) to service_role;
