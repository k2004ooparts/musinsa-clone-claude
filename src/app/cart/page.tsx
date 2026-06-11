"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import { getProduct, salePrice } from "@/data/products";
import { FREE_SHIPPING_THRESHOLD, shippingFee, won } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const mounted = useMounted();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleChecked = useCartStore((s) => s.toggleChecked);
  const setAllChecked = useCartStore((s) => s.setAllChecked);
  const removeChecked = useCartStore((s) => s.removeChecked);

  if (!mounted) return <div className="pt-6" />;

  const rows = items.flatMap((i) => {
    const product = getProduct(i.productId);
    return product ? [{ ...i, product }] : [];
  });

  if (rows.length === 0) {
    return (
      <div className="py-28 text-center">
        <p className="text-sm text-neutral-400">장바구니에 담긴 상품이 없습니다.</p>
        <Link
          href="/products"
          className="mt-5 inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
        >
          쇼핑하러 가기
        </Link>
      </div>
    );
  }

  const checkedRows = rows.filter((r) => r.checked);
  const subtotal = checkedRows.reduce(
    (acc, r) => acc + salePrice(r.product) * r.quantity,
    0,
  );
  const fee = shippingFee(subtotal);
  const allChecked = rows.every((r) => r.checked);

  return (
    <div className="pt-6">
      <h1 className="text-xl font-bold">
        장바구니 <span className="text-neutral-400">{rows.length}</span>
      </h1>
      <div className="mt-6 grid items-start gap-8 md:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-center justify-between border-b border-black pb-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-black"
                checked={allChecked}
                onChange={(e) => setAllChecked(e.target.checked)}
              />
              전체 선택 ({checkedRows.length}/{rows.length})
            </label>
            <button
              type="button"
              onClick={removeChecked}
              className="text-xs text-neutral-400 hover:text-black"
            >
              선택 삭제
            </button>
          </div>
          <ul className="divide-y divide-neutral-100">
            {rows.map((r) => (
              <li key={`${r.productId}-${r.size}`} className="flex gap-3 py-4">
                <input
                  type="checkbox"
                  aria-label={`${r.product.name} 선택`}
                  className="mt-1 h-4 w-4 shrink-0 accent-black"
                  checked={r.checked}
                  onChange={() => toggleChecked(r.productId, r.size)}
                />
                <Link href={`/product/${r.productId}`} className="shrink-0">
                  <ProductImage
                    product={r.product}
                    className="aspect-[3/4] w-20 rounded-md"
                    emojiClassName="text-3xl"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{r.product.brand}</p>
                  <p className="truncate text-sm">{r.product.name}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">옵션: {r.size}</p>
                  <div className="mt-2 flex w-fit items-center rounded border border-neutral-200 text-sm">
                    <button
                      type="button"
                      aria-label="수량 줄이기"
                      onClick={() => setQuantity(r.productId, r.size, r.quantity - 1)}
                      className="px-2.5 py-1"
                    >
                      −
                    </button>
                    <span className="w-7 text-center tabular-nums">{r.quantity}</span>
                    <button
                      type="button"
                      aria-label="수량 늘리기"
                      onClick={() => setQuantity(r.productId, r.size, r.quantity + 1)}
                      className="px-2.5 py-1"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    type="button"
                    aria-label="삭제"
                    onClick={() => removeItem(r.productId, r.size)}
                    className="text-neutral-300 hover:text-black"
                  >
                    ✕
                  </button>
                  <p className="text-sm font-bold">
                    {won(salePrice(r.product) * r.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-xl border border-neutral-200 p-5 md:sticky md:top-32">
          <h2 className="text-sm font-bold">결제 정보</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-400">상품 금액</dt>
              <dd>{won(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-400">배송비</dt>
              <dd>{fee === 0 ? "무료" : won(fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-bold">
              <dt>총 결제 금액</dt>
              <dd>{won(subtotal + fee)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[11px] text-neutral-400">
            {won(FREE_SHIPPING_THRESHOLD)} 이상 구매 시 무료배송
          </p>
          <button
            type="button"
            disabled={checkedRows.length === 0}
            onClick={() => router.push("/checkout")}
            className="mt-4 h-12 w-full rounded-md bg-black text-sm font-bold text-white disabled:bg-neutral-200"
          >
            주문하기 ({checkedRows.length})
          </button>
        </aside>
      </div>
    </div>
  );
}
