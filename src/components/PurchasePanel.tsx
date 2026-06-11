"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { salePrice, type Product } from "@/data/products";
import { won } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { useCartStore } from "@/store/cart";
import { useLikesStore } from "@/store/likes";

export default function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const mounted = useMounted();
  const [size, setSize] = useState(
    product.sizes.length === 1 ? product.sizes[0] : "",
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const addItem = useCartStore((s) => s.addItem);
  const liked = useLikesStore((s) => s.ids.includes(product.id));
  const toggleLike = useLikesStore((s) => s.toggle);
  const final = salePrice(product);

  const validate = () => {
    if (!size) {
      setError("사이즈를 선택해주세요.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    addItem(product.id, size, quantity);
    setAdded(true);
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    addItem(product.id, size, quantity);
    router.push("/checkout");
  };

  return (
    <div className="mt-6 space-y-4">
      <div>
        <label htmlFor="size-select" className="text-sm font-medium">
          사이즈
        </label>
        <select
          id="size-select"
          value={size}
          onChange={(e) => {
            setSize(e.target.value);
            setError("");
          }}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm"
        >
          <option value="">사이즈 선택</option>
          {product.sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center rounded-md border border-neutral-300">
          <button
            type="button"
            aria-label="수량 줄이기"
            onClick={() => setQuantity((n) => Math.max(1, n - 1))}
            className="px-3 py-1.5"
          >
            −
          </button>
          <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
          <button
            type="button"
            aria-label="수량 늘리기"
            onClick={() => setQuantity((n) => n + 1)}
            className="px-3 py-1.5"
          >
            +
          </button>
        </div>
        <p className="text-sm">
          총 <span className="text-lg font-bold">{won(final * quantity)}</span>
        </p>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      {added && (
        <p className="text-xs text-green-600">
          장바구니에 담았습니다.{" "}
          <Link href="/cart" className="font-medium underline">
            장바구니 보기 →
          </Link>
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          aria-label="찜하기"
          onClick={() => toggleLike(product.id)}
          className="h-12 w-12 shrink-0 rounded-md border border-neutral-300 text-lg"
        >
          {mounted && liked ? "❤️" : "🤍"}
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          className="h-12 flex-1 rounded-md border border-black text-sm font-bold"
        >
          장바구니
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="h-12 flex-1 rounded-md bg-black text-sm font-bold text-white"
        >
          바로 구매
        </button>
      </div>
    </div>
  );
}
