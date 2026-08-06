import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyerName, buyerEmail, buyerPhone } = body;

    // Single product checkout
    const { productId, productSlug } = body;
    // Cart checkout
    const cartItems: { id: number; slug: string }[] | undefined = body.cartItems;

    if (!buyerEmail) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json({ error: "Payment gateway not configured." }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const sb = createClient(supabaseUrl, supabaseServiceKey);

    let totalPaise = 0;
    let orderProductId: number | null = null;
    let orderProductSlug = "";
    let itemsJson: { id: number; slug: string; name: string; price: number }[] = [];

    if (cartItems && cartItems.length > 0) {
      // Cart checkout — fetch all products
      const ids = cartItems.map((i) => i.id);
      const { data: products, error } = await sb
        .from("aivexa_digital_products")
        .select("id, slug, name, price")
        .in("id", ids)
        .eq("is_active", true);

      if (error || !products || products.length === 0) {
        return NextResponse.json({ error: "Products not found." }, { status: 404 });
      }

      itemsJson = products.map((p) => ({ id: p.id, slug: p.slug, name: p.name, price: p.price }));
      totalPaise = itemsJson.reduce((sum, p) => sum + p.price, 0);
      orderProductId = null;
      orderProductSlug = cartItems.map((i) => i.slug).join(",");
    } else if (productId) {
      // Single product checkout
      const { data: product, error } = await sb
        .from("aivexa_digital_products")
        .select("id, slug, name, price")
        .eq("id", productId)
        .eq("is_active", true)
        .maybeSingle();

      if (error || !product) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
      }

      totalPaise = product.price;
      orderProductId = product.id;
      orderProductSlug = productSlug || product.slug;
      itemsJson = [{ id: product.id, slug: product.slug, name: product.name, price: product.price }];
    } else {
      return NextResponse.json({ error: "No product specified." }, { status: 400 });
    }

    // Create Razorpay order
    const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
      body: JSON.stringify({
        amount: totalPaise,
        currency: "INR",
        receipt: `aivexa_${Date.now()}`,
        notes: { buyer_email: buyerEmail, buyer_name: buyerName },
      }),
    });

    if (!rzpRes.ok) {
      console.error("Razorpay error:", await rzpRes.text());
      return NextResponse.json({ error: "Failed to create payment order." }, { status: 500 });
    }

    const rzpOrder = await rzpRes.json();

    // Save order record — product_id is nullable for cart orders
    const insertPayload: Record<string, unknown> = {
      razorpay_order_id: rzpOrder.id,
      product_slug: orderProductSlug,
      buyer_name: buyerName || "",
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone || "",
      amount_paise: totalPaise,
      status: "created",
      items: itemsJson,
    };
    if (orderProductId) insertPayload.product_id = orderProductId;

    await sb.from("aivexa_orders").insert(insertPayload);

    return NextResponse.json({ orderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
