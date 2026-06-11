"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";
import { useMounted } from "@/lib/useMounted";
import { useLikesStore } from "@/store/likes";

export default function LikesPage() {
  const mounted = useMounted();
  const ids = useLikesStore((s) => s.ids);

  if (!mounted) return <div className="pt-6" />;

  const liked = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="pt-6">
      <h1 className="text-xl font-bold">
        찜한 상품 <span className="text-neutral-400">{liked.length}</span>
      </h1>
      {liked.length === 0 ? (
        <div className="py-28 text-center">
          <p className="text-sm text-neutral-400">아직 찜한 상품이 없습니다.</p>
          <Link
            href="/products"
            className="mt-5 inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
          >
            상품 둘러보기
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
          {liked.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
