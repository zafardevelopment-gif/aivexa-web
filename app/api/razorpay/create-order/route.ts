import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { productId, productSlug, buyerName, buyerEmail, buyerPhone } =
      await req.json();

    if (!productId || !buyerEmail) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json({ error: "Payment gateway not configured." }, { status: 500 });
    }

    // Fetch product price from DB
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const sb = createClient(supabaseUrl, supabaseServiceKey);
    const { data: product, error: productError } = await sb
      .from("aivexa_digital_products")
      .select("id, price, name")
      .eq("id", productId)
      .eq("is_active", true)
      .maybeSingle();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Create Razorpay order via their REST API (avoids SDK import issues)
    const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: product.price, // already in paise
        currency: "INR",
        receipt: `dp_${productId}_${Date.now()}`,
        notes: {
          product_slug: productSlug,
          buyer_email: buyerEmail,
          buyer_name: buyerName,
        },
      }),
    });

    if (!rzpRes.ok) {
      const err = await rzpRes.json();
      console.error("Razorpay order error:", err);
      return NextResponse.json({ error: "Failed to create payment order." }, { status: 500 });
    }

    const rzpOrder = await rzpRes.json();

    // Save order record in Supabase (status: created)
    await sb.from("aivexa_orders").insert({
      razorpay_order_id: rzpOrder.id,
      product_id: product.id,
      product_slug: productSlug,
      buyer_name: buyerName || "",
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone || "",
      amount_paise: product.price,
      status: "created",
    });

    return NextResponse.json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
