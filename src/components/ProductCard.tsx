"use client";

import Link from "next/link";
import { salePrice, type Product } from "@/data/products";
import { won } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { useLikesStore } from "@/store/likes";
import ProductImage from "./ProductImage";

export default function ProductCard({
  product,
  rank,
}: {
  product: Product;
  rank?: number;
}) {
  const mounted = useMounted();
  const liked = useLikesStore((s) => s.ids.includes(product.id));
  const toggle = useLikesStore((s) => s.toggle);
  const final = salePrice(product);

  return (
    <div className="group relative">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-md">
          <ProductImage
            product={product}
            className="aspect-[3/4] w-full transition-transform duration-300 group-hover:scale-105"
          />
          {rank !== undefined && (
            <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center bg-black text-xs font-bold text-white">
              {rank}
            </span>
          )}
        </div>
        <div className="mt-2 space-y-0.5">
          <p className="truncate text-xs font-bold">{product.brand}</p>
          <p className="line-clamp-2 text-sm leading-snug text-neutral-600">
            {product.name}
          </p>
          <p className="pt-0.5 text-sm">
            {product.discountRate > 0 && (
              <span className="mr-1 font-bold text-red-500">
                {product.discountRate}%
              </span>
            )}
            <span className="font-bold">{won(final)}</span>
          </p>
          {product.discountRate > 0 && (
            <p className="text-xs text-neutral-400 line-through">
              {won(product.price)}
            </p>
          )}
          <p className="text-xs text-neutral-400">
            ★ {product.rating.toFixed(1)} · 리뷰 {product.reviewCount.toLocaleString("ko-KR")}
          </p>
        </div>
      </Link>
      <button
        type="button"
        aria-label={`${product.name} 찜하기`}
        onClick={() => toggle(product.id)}
        className="absolute right-2 top-2 z-10 text-lg leading-none drop-shadow-sm"
      >
        {mounted && liked ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
