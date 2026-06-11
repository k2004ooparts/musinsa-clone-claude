import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import PurchasePanel from "@/components/PurchasePanel";
import { getProduct, PRODUCTS, salePrice } from "@/data/products";
import { getReviews } from "@/data/reviews";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, won } from "@/lib/format";

// 정적 export를 위해 모든 상품 페이지를 빌드 시점에 생성한다.
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const reviews = getReviews(product);
  const final = salePrice(product);

  return (
    <div className="pt-6">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductImage
          product={product}
          className="aspect-[3/4] w-full rounded-xl"
          emojiClassName="text-8xl"
        />
        <div>
          <p className="text-sm font-bold">{product.brand}</p>
          <h1 className="mt-1 text-xl font-medium">{product.name}</h1>
          <p className="mt-1 text-sm text-neutral-400">
            ★ {product.rating.toFixed(1)} · 후기{" "}
            {product.reviewCount.toLocaleString("ko-KR")}개
          </p>

          <div className="mt-4 border-t border-neutral-200 pt-4">
            {product.discountRate > 0 && (
              <p className="text-sm text-neutral-400 line-through">
                {won(product.price)}
              </p>
            )}
            <p className="mt-0.5">
              {product.discountRate > 0 && (
                <span className="mr-2 text-xl font-bold text-red-500">
                  {product.discountRate}%
                </span>
              )}
              <span className="text-2xl font-bold">{won(final)}</span>
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              배송비 {won(SHIPPING_FEE)} · {won(FREE_SHIPPING_THRESHOLD)} 이상 구매 시
              무료배송
            </p>
          </div>

          <PurchasePanel product={product} />
        </div>
      </div>

      <section className="mt-14" aria-label="후기">
        <h2 className="mb-2 text-lg font-bold">
          후기 <span className="text-neutral-400">{reviews.length}</span>
        </h2>
        <ul className="divide-y divide-neutral-100 border-t border-neutral-200">
          {reviews.map((r) => (
            <li key={r.id} className="py-4">
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-neutral-400">
                <span className="text-black" aria-label={`별점 ${r.rating}점`}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
                <span>{r.user}</span>
                <span>{r.date}</span>
                <span>옵션: {r.size}</span>
              </div>
              <p className="mt-1.5 text-sm">{r.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
