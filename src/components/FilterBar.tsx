"use client";

import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/products";

const PRICE_OPTIONS = [
  { value: "", label: "가격 전체" },
  { value: "0-30000", label: "3만원 미만" },
  { value: "30000-50000", label: "3만원 ~ 5만원" },
  { value: "50000-100000", label: "5만원 ~ 10만원" },
  { value: "100000-0", label: "10만원 이상" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "인기순" },
  { value: "low", label: "낮은 가격순" },
  { value: "high", label: "높은 가격순" },
  { value: "review", label: "리뷰 많은 순" },
];

export default function FilterBar({
  brands,
  current,
}: {
  brands: string[];
  current: Record<string, string | undefined>;
}) {
  const router = useRouter();

  const update = (key: string, value: string) => {
    const merged: Record<string, string | undefined> = { ...current, [key]: value };
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) {
      if (v) qs.set(k, v);
    }
    router.push(`/products?${qs.toString()}`);
  };

  const selectCls =
    "rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="카테고리 필터"
        value={current.category ?? ""}
        onChange={(e) => update("category", e.target.value)}
        className={selectCls}
      >
        <option value="">카테고리 전체</option>
        {CATEGORIES.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.label}
          </option>
        ))}
      </select>
      <select
        aria-label="브랜드 필터"
        value={current.brand ?? ""}
        onChange={(e) => update("brand", e.target.value)}
        className={selectCls}
      >
        <option value="">브랜드 전체</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <select
        aria-label="가격 필터"
        value={current.price ?? ""}
        onChange={(e) => update("price", e.target.value)}
        className={selectCls}
      >
        {PRICE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <label className={`${selectCls} flex cursor-pointer items-center gap-1.5`}>
        <input
          type="checkbox"
          className="accent-black"
          checked={current.sale === "1"}
          onChange={(e) => update("sale", e.target.checked ? "1" : "")}
        />
        세일 상품만
      </label>
      <select
        aria-label="정렬"
        value={current.sort ?? "popular"}
        onChange={(e) => update("sort", e.target.value)}
        className={`${selectCls} ml-auto`}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
