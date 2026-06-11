"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/data/products";
import { DEMO_USER } from "@/data/user";
import { useMounted } from "@/lib/useMounted";
import { useCartStore } from "@/store/cart";
import { useLikesStore } from "@/store/likes";

export default function Header() {
  const router = useRouter();
  const mounted = useMounted();
  const [q, setQ] = useState("");
  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0),
  );
  const likeCount = useLikesStore((s) => s.ids.length);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center gap-3 md:gap-5">
          <Link href="/" className="shrink-0 text-xl font-black tracking-tighter">
            MUSINSA
          </Link>
          <form
            className="min-w-0 flex-1 md:max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/products?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="상품, 브랜드 검색"
              aria-label="검색어"
              className="w-full rounded-full bg-neutral-100 px-4 py-2 text-sm outline-none placeholder:text-neutral-400 focus:bg-neutral-200/70"
            />
          </form>
          <nav className="ml-auto flex shrink-0 items-center gap-4 text-sm font-medium">
            <span className="hidden text-neutral-500 sm:inline">
              <strong className="font-bold text-black">{DEMO_USER.nickname}</strong>님
            </span>
            <Link href="/likes" className="flex items-center gap-1" aria-label="찜 목록">
              <span aria-hidden>♥</span>
              <span className="tabular-nums">{mounted ? likeCount : 0}</span>
            </Link>
            <Link href="/cart" className="relative" aria-label="장바구니">
              장바구니
              {mounted && cartCount > 0 && (
                <span className="absolute -right-3 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
        <nav className="flex h-11 items-center gap-5 overflow-x-auto text-sm font-medium whitespace-nowrap">
          <Link href="/products?sort=popular" className="font-bold">
            랭킹
          </Link>
          <Link href="/products?sale=1" className="font-bold text-red-500">
            세일
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className="text-neutral-600 hover:text-black"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
