"use client";

import { useState } from "react";
import { X, Trash2, ShoppingBag, Loader2, Lock, FileDown } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/digital-products";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "razorpay-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CartDrawer() {
  const { items, count, total, removeItem, clearCart, isOpen, closeCart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout">("cart");

  async function handleCheckout() {
    if (!name.trim() || !email.trim()) {
      setError("Name aur email zaroori hain.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { setError("Payment gateway load nahi hua."); setLoading(false); return; }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items.map((i) => ({ id: i.id, slug: i.slug })),
          buyerName: name.trim(),
          buyerEmail: email.trim(),
          buyerPhone: phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error || "Order create nahi hua."); setLoading(false); return; }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "AIVEXA Digital Store",
        description: items.length === 1 ? items[0].name : `${items.length} Digital Products`,
        order_id: data.orderId,
        prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
        theme: { color: "#4f46e5" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            closeCart();
            window.location.href = `/store/order-success?order=${response.razorpay_order_id}`;
          } else {
            setError("Payment verify nahi hua. Support se contact karein.");
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError("Kuch galat hua. Dobara try karein.");
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="cart-backdrop" onClick={closeCart} />
      )}

      {/* Drawer */}
      <div className={`cart-drawer${isOpen ? " open" : ""}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <ShoppingBag size={18} strokeWidth={2} />
            <span>Cart</span>
            {count > 0 && <span className="cart-count-badge">{count}</span>}
          </div>
          <button className="cart-close" onClick={closeCart} aria-label="Close cart">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={40} strokeWidth={1.3} />
              <p>Cart khaali hai</p>
              <span>Koi product add karein</span>
            </div>
          ) : step === "cart" ? (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-thumb">
                      {item.preview_image ? (
                        <img src={item.preview_image} alt={item.name} />
                      ) : (
                        <div className="cart-item-thumb-placeholder">
                          <FileDown size={18} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      {item.category && <span className="cart-item-cat">{item.category}</span>}
                      <span className="cart-item-price">{formatPrice(item.price)}</span>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeItem(item.id)} aria-label="Remove">
                      <Trash2 size={15} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total-row">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <button className="dp-pay-btn" onClick={() => setStep("checkout")}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          ) : (
            <>
              <button className="cart-back-btn" onClick={() => { setStep("cart"); setError(""); }}>
                ← Back to Cart
              </button>

              <div className="cart-checkout-summary">
                <p className="cart-checkout-summary-label">{count} item{count > 1 ? "s" : ""} · {formatPrice(total)}</p>
              </div>

              <div className="dp-checkout-form" style={{ border: "none", padding: 0, background: "transparent", boxShadow: "none" }}>
                <p className="dp-checkout-form-title">Your details</p>
                <div className="dp-form-row">
                  <label>Name *</label>
                  <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
                </div>
                <div className="dp-form-row">
                  <label>Email *</label>
                  <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                </div>
                <div className="dp-form-row">
                  <label>Phone (optional)</label>
                  <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
                </div>
                {error && <p className="dp-form-error">{error}</p>}
              </div>

              <div className="cart-footer" style={{ marginTop: "1rem" }}>
                <button className="dp-pay-btn" onClick={handleCheckout} disabled={loading}>
                  {loading
                    ? <><Loader2 size={17} strokeWidth={2} className="spin" /> Processing…</>
                    : <><Lock size={15} strokeWidth={2.2} /> Pay {formatPrice(total)}</>
                  }
                </button>
                <p className="dp-pay-note" style={{ marginTop: ".6rem" }}>
                  <Lock size={11} strokeWidth={2.5} /> Powered by Razorpay · 100% Secure
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
