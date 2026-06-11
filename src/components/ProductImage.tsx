import { CATEGORIES, type Product } from "@/data/products";

// 이미지 placeholder — 상품 id로 결정되는 그라데이션 + 카테고리 이모지
const PALETTES: [string, string][] = [
  ["#ececec", "#d4d4d4"],
  ["#f5f1ea", "#e3dccf"],
  ["#e8eaed", "#cfd4da"],
  ["#f0e9e4", "#ddd0c4"],
  ["#eef0ec", "#d6dad2"],
];

export default function ProductImage({
  product,
  className = "",
  emojiClassName = "text-5xl",
}: {
  product: Product;
  className?: string;
  emojiClassName?: string;
}) {
  const hash = [...product.id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const [from, to] = PALETTES[hash % PALETTES.length];
  const emoji = CATEGORIES.find((c) => c.slug === product.category)?.emoji ?? "🛍️";
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <span className={emojiClassName} role="img" aria-label={product.name}>
        {emoji}
      </span>
    </div>
  );
}
