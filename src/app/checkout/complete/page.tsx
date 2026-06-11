"use client";

import Link from "next/link";
import { won } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { useOrderStore } from "@/store/order";

export default function OrderCompletePage() {
  const mounted = useMounted();
  const order = useOrderStore((s) => s.lastOrder);

  if (!mounted) return <div className="pt-6" />;

  if (!order) {
    return (
      <div className="py-28 text-center">
        <p className="text-sm text-neutral-400">주문 정보가 없습니다.</p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
        >
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-bold">주문이 완료되었습니다</h1>
      <p className="mt-2 text-sm text-neutral-400">주문번호 {order.orderNo}</p>

      <dl className="mt-8 space-y-2.5 rounded-xl border border-neutral-200 p-5 text-left text-sm">
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-neutral-400">받는 분</dt>
          <dd>{order.receiver}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-neutral-400">배송지</dt>
          <dd className="text-right">{order.address}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="shrink-0 text-neutral-400">상품 수</dt>
          <dd>{order.itemCount}개</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-neutral-100 pt-2.5 font-bold">
          <dt>결제 금액</dt>
          <dd>{won(order.total)}</dd>
        </div>
      </dl>

      <div className="mt-8 flex gap-2">
        <Link
          href="/"
          className="flex h-12 flex-1 items-center justify-center rounded-md border border-neutral-300 text-sm font-bold"
        >
          홈으로
        </Link>
        <Link
          href="/products"
          className="flex h-12 flex-1 items-center justify-center rounded-md bg-black text-sm font-bold text-white"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
