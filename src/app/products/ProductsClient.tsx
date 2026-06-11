"use client";

import { useSearchParams } from "next/navigation";
import FilterBar from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";
import { ALL_BRANDS, CATEGORIES, PRODUCTS, salePrice } from "@/data/products";

export default function ProductsClient() {
  const sp = useSearchParams();
  const params = {
    q: sp.get("q") ?? undefined,
    category: sp.get("category") ?? undefined,
    brand: sp.get("brand") ?? undefined,
    price: sp.get("price") ?? undefined,
    sale: sp.get("sale") ?? undefined,
    sort: sp.get("sort") ?? undefined,
  };

  let list = [...PRODUCTS];
  if (params.category) {
    list = list.filter((p) => p.category === params.category);
  }
  if (params.brand) {
    list = list.filter((p) => p.brand === params.brand);
  }
  if (params.sale === "1") {
    list = list.filter((p) => p.discountRate > 0);
  }
  if (params.price) {
    const [min, max] = params.price.split("-").map(Number);
    list = list.filter((p) => {
      const sp2 = salePrice(p);
      return sp2 >= min && (max === 0 || sp2 < max);
    });
  }
  const q = params.q?.trim();
  if (q) {
    list = list.filter((p) => p.name.includes(q) || p.brand.includes(q));
  }

  const sort = params.sort ?? "popular";
  list.sort((a, b) => {
    switch (sort) {
      case "low":
        return salePrice(a) - salePrice(b);
      case "high":
        return salePrice(b) - salePrice(a);
      case "review":
        return b.reviewCount - a.reviewCount;
      default:
        return b.popularity - a.popularity;
    }
  });

  const categoryLabel = CATEGORIES.find((c) => c.slug === params.category)?.label;
  const title = q
    ? `'${q}' 검색 결과`
    : (categoryLabel ?? (params.sale === "1" ? "세일" : "전체 상품"));

  return (
    <div className="pt-6">
      <h1 className="mb-4 text-xl font-bold">
        {title}{" "}
        <span className="text-sm font-normal text-neutral-400">{list.length}개</span>
      </h1>
      <FilterBar brands={ALL_BRANDS} current={params} />
      {list.length === 0 ? (
        <p className="py-24 text-center text-sm text-neutral-400">
          조건에 맞는 상품이 없습니다.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
