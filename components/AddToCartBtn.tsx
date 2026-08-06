"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";

interface Props {
  product: CartItem;
  variant?: "card" | "detail";
}

export default function AddToCartBtn({ product, variant = "card" }: Props) {
  const { addItem, isInCart, openCart } = useCart();
  const inCart = isInCart(product.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      openCart();
    } else {
      addItem(product);
    }
  }

  if (variant === "detail") {
    return (
      <button
        className={`dp-cart-btn-detail${inCart ? " in-cart" : ""}`}
        onClick={handleClick}
      >
        {inCart ? (
          <><Check size={17} strokeWidth={2.5} /> Added to Cart</>
        ) : (
          <><ShoppingCart size={17} strokeWidth={2} /> Add to Cart</>
        )}
      </button>
    );
  }

  return (
    <button
      className={`dp-cart-btn-card${inCart ? " in-cart" : ""}`}
      onClick={handleClick}
      aria-label={inCart ? "View cart" : "Add to cart"}
      title={inCart ? "View cart" : "Add to cart"}
    >
      {inCart ? <Check size={14} strokeWidth={2.5} /> : <ShoppingCart size={14} strokeWidth={2} />}
    </button>
  );
}
