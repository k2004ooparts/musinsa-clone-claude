"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import { getProduct, salePrice } from "@/data/products";
import { DEMO_USER } from "@/data/user";
import { shippingFee, won } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { useCartStore } from "@/store/cart";
import { useOrderStore } from "@/store/order";

const PAYMENTS = [
  { value: "card", label: "신용카드" },
  { value: "bank", label: "무통장입금" },
  { value: "phone", label: "휴대폰 결제" },
];

export default function CheckoutPage() {
  const mounted = useMounted();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeChecked = useCartStore((s) => s.removeChecked);
  const setOrder = useOrderStore((s) => s.setOrder);
  const [form, setForm] = useState({
    receiver: DEMO_USER.nickname,
    phone: "",
    address: "",
    memo: "",
  });
  const [payment, setPayment] = useState("card");

  if (!mounted) return <div className="pt-6" />;

  const rows = items
    .filter((i) => i.checked)
    .flatMap((i) => {
      const product = getProduct(i.productId);
      return product ? [{ ...i, product }] : [];
    });

  if (rows.length === 0) {
    return (
      <div className="py-28 text-center">
        <p className="text-sm text-neutral-400">주문할 상품이 없습니다.</p>
        <Link
          href="/products"
          className="mt-5 inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
        >
          상품 보러 가기
        </Link>
      </div>
    );
  }

  const subtotal = rows.reduce((acc, r) => acc + salePrice(r.product) * r.quantity, 0);
  const fee = shippingFee(subtotal);
  const total = subtotal + fee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.receiver.trim() || !form.phone.trim() || !form.address.trim()) return;
    setOrder({
      orderNo: `MS-${Date.now()}`,
      receiver: form.receiver.trim(),
      address: form.address.trim(),
      total,
      itemCount: rows.reduce((acc, r) => acc + r.quantity, 0),
    });
    removeChecked();
    router.push("/checkout/complete");
  };

  const inputCls =
    "mt-1 w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-black";

  return (
    <form onSubmit={handleSubmit} className="pt-6">
      <h1 className="text-xl font-bold">주문/결제</h1>
      <div className="mt-6 grid items-start gap-8 md:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <section>
            <h2 className="border-b border-black pb-3 text-sm font-bold">
              주문 상품 ({rows.length})
            </h2>
            <ul className="divide-y divide-neutral-100">
              {rows.map((r) => (
                <li key={`${r.productId}-${r.size}`} className="flex gap-3 py-4">
                  <ProductImage
                    product={r.product}
                    className="aspect-[3/4] w-16 shrink-0 rounded-md"
                    emojiClassName="text-2xl"
                  />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="text-xs font-bold">{r.product.brand}</p>
                    <p className="truncate">{r.product.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {r.size} / {r.quantity}개
                    </p>
                  </div>
                  <p className="self-center text-sm font-bold">
                    {won(salePrice(r.product) * r.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="border-b border-black pb-3 text-sm font-bold">배송 정보</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="receiver" className="text-sm font-medium">
                  받는 분 *
                </label>
                <input
                  id="receiver"
                  required
                  value={form.receiver}
                  onChange={(e) => setForm({ ...form, receiver: e.target.value })}
                  placeholder="이름"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium">
                  연락처 *
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="address" className="text-sm font-medium">
                  주소 *
                </label>
                <input
                  id="address"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="배송 받을 주소"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="memo" className="text-sm font-medium">
                  배송 요청사항
                </label>
                <input
                  id="memo"
                  value={form.memo}
                  onChange={(e) => setForm({ ...form, memo: e.target.value })}
                  placeholder="예) 문 앞에 놓아주세요"
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="border-b border-black pb-3 text-sm font-bold">
              결제 수단 <span className="font-normal text-neutral-400">(데모 — 실제 결제 없음)</span>
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {PAYMENTS.map((p) => (
                <label
                  key={p.value}
                  className={`cursor-pointer rounded-md border px-4 py-2.5 text-sm ${
                    payment === p.value
                      ? "border-black font-bold"
                      : "border-neutral-200 text-neutral-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={p.value}
                    checked={payment === p.value}
                    onChange={() => setPayment(p.value)}
                    className="sr-only"
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-xl border border-neutral-200 p-5 md:sticky md:top-32">
          <h2 className="text-sm font-bold">결제 금액</h2>
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
              <dd>{won(total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            className="mt-4 h-12 w-full rounded-md bg-black text-sm font-bold text-white"
          >
            {won(total)} 결제하기
          </button>
        </aside>
      </div>
    </form>
  );
}
