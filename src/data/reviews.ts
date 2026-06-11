import type { Product } from "./products";

export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  content: string;
  size: string;
}

const COMMENTS = [
  "핏이 예쁘고 재질도 좋아요. 데일리로 입기 딱입니다.",
  "사이즈 정사이즈예요. 배송도 빨랐습니다.",
  "사진이랑 색감이 거의 같아요. 만족합니다!",
  "가격 대비 퀄리티가 훌륭해요. 재구매 의사 있습니다.",
  "선물용으로 샀는데 반응이 좋았어요.",
  "마감이 깔끔하고 고급스러워요. 추천합니다.",
  "생각보다 살짝 커요. 한 사이즈 작게 추천!",
  "매일 손이 가는 제품이에요. 강력 추천합니다.",
];

const USERS = ["김**", "이**", "박**", "최**", "정**", "한**", "조**", "윤**"];

const DATES = ["2026.06.02", "2026.05.27", "2026.05.18", "2026.05.06", "2026.04.21"];

export function getReviews(product: Product): Review[] {
  const hash = [...product.id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const count = 3 + (hash % 3);
  return Array.from({ length: count }, (_, i) => {
    const n = hash + i;
    return {
      id: `${product.id}-r${i}`,
      user: USERS[n % USERS.length],
      rating: 5 - (n % 3 === 0 ? 1 : 0) - (n % 7 === 0 ? 1 : 0),
      date: DATES[n % DATES.length],
      content: COMMENTS[(hash + i * 3) % COMMENTS.length],
      size: product.sizes[n % product.sizes.length],
    };
  });
}
