import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/data/products";

export default function Home() {
  const ranking = [...PRODUCTS]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);
  const sale = PRODUCTS.filter((p) => p.discountRate >= 30)
    .sort((a, b) => b.discountRate - a.discountRate)
    .slice(0, 8);

  return (
    <div className="space-y-14 pt-6">
      {/* 메인 배너 */}
      <section className="rounded-2xl bg-black px-8 py-14 text-white md:py-20">
        <p className="mb-2 text-sm tracking-widest text-neutral-400">2026 SUMMER</p>
        <h1 className="text-3xl font-black leading-tight md:text-5xl">
          시즌 오프 세일
          <br />
          최대 50% OFF
        </h1>
        <Link
          href="/products?sale=1"
          className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-black"
        >
          세일 상품 보기
        </Link>
      </section>

      {/* 카테고리 메뉴 */}
      <section aria-label="카테고리">
        <div className="grid max-w-lg grid-cols-5 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className="flex flex-col items-center gap-2"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-2xl md:h-16 md:w-16">
                {c.emoji}
              </span>
              <span className="text-xs font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 랭킹 TOP 10 */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold">실시간 랭킹 TOP 10</h2>
          <Link href="/products?sort=popular" className="text-xs text-neutral-400">
            더보기 +
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
          {ranking.map((p, i) => (
            <ProductCard key={p.id} product={p} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* 세일 섹션 */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold">
            놓치면 후회할 <span className="text-red-500">세일</span>
          </h2>
          <Link href="/products?sale=1" className="text-xs text-neutral-400">
            더보기 +
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
          {sale.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
