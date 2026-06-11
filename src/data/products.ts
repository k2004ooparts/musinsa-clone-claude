export type Category = "top" | "bottom" | "shoes" | "bag" | "beauty";

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: Category;
  price: number; // 정가
  discountRate: number; // 0~50 (%)
  rating: number;
  reviewCount: number;
  popularity: number;
  sizes: string[];
}

export const CATEGORIES: { slug: Category; label: string; emoji: string }[] = [
  { slug: "top", label: "상의", emoji: "👕" },
  { slug: "bottom", label: "하의", emoji: "👖" },
  { slug: "shoes", label: "신발", emoji: "👟" },
  { slug: "bag", label: "가방", emoji: "👜" },
  { slug: "beauty", label: "뷰티", emoji: "🧴" },
];

const BRANDS = [
  "커버낫",
  "디스이즈네버댓",
  "마르디 메크르디",
  "아디다스",
  "나이키",
  "무신사 스탠다드",
  "스튜시",
  "칼하트 WIP",
  "뉴발란스",
  "어반드레스",
  "라퍼지스토어",
  "토피",
];

const NAMES: Record<Category, string[]> = {
  top: [
    "오버핏 로고 반팔 티셔츠",
    "피그먼트 후드 스웨트셔츠",
    "스트라이프 옥스포드 셔츠",
    "베이직 크루넥 맨투맨",
    "서머 린넨 카라 셔츠",
    "그래픽 프린트 티셔츠",
  ],
  bottom: [
    "와이드 데님 팬츠",
    "원턱 스웨트 쇼츠",
    "스트레이트 치노 팬츠",
    "카고 조거 팬츠",
    "세미와이드 슬랙스",
    "버뮤다 데님 쇼츠",
  ],
  shoes: [
    "클래식 로우 스니커즈",
    "청키 러닝화",
    "스웨이드 더비 슈즈",
    "레트로 코트 스니커즈",
    "경량 슬립온",
    "트레일 샌들",
  ],
  bag: [
    "미니 크로스백",
    "캔버스 토트백",
    "코듀라 백팩",
    "숄더 메신저백",
    "나일론 슬링백",
    "레더 카드 지갑",
  ],
  beauty: [
    "수분 진정 토너",
    "비건 선크림 SPF50+",
    "딥 클렌징 폼",
    "퍼퓸 핸드크림",
    "멀티 밤 스틱",
    "헤어 텍스처 왁스",
  ],
};

const VARIANTS: Record<Category, [string, string]> = {
  top: ["블랙", "아이보리"],
  bottom: ["블랙", "라이트 블루"],
  shoes: ["블랙", "화이트"],
  bag: ["블랙", "베이지"],
  beauty: ["단품", "기획세트"],
};

const BASE_PRICE: Record<Category, number> = {
  top: 29000,
  bottom: 39000,
  shoes: 69000,
  bag: 35000,
  beauty: 15000,
};

const SIZES: Record<Category, string[]> = {
  top: ["S", "M", "L", "XL"],
  bottom: ["S", "M", "L", "XL"],
  shoes: ["250", "255", "260", "265", "270", "275", "280"],
  bag: ["FREE"],
  beauty: ["단품"],
};

// 시드 고정 PRNG — 서버/클라이언트 어디서 만들어도 항상 같은 데이터가 나온다.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function build(): Product[] {
  const rand = seeded(20260612);
  const products: Product[] = [];
  for (const cat of CATEGORIES) {
    for (let i = 0; i < 12; i++) {
      const baseName = NAMES[cat.slug][i % 6];
      const variant = VARIANTS[cat.slug][i < 6 ? 0 : 1];
      const price = BASE_PRICE[cat.slug] + Math.floor(rand() * 12) * 5000;
      const onSale = rand() < 0.65;
      const discountRate = onSale ? (Math.floor(rand() * 9) + 2) * 5 : 0; // 10~50%
      products.push({
        id: `${cat.slug}-${i + 1}`,
        brand: BRANDS[Math.floor(rand() * BRANDS.length)],
        name: `${baseName} ${variant}`,
        category: cat.slug,
        price,
        discountRate,
        rating: Math.round((3.5 + rand() * 1.5) * 10) / 10,
        reviewCount: Math.floor(rand() * 4800) + 12,
        popularity: Math.floor(rand() * 10000),
        sizes: SIZES[cat.slug],
      });
    }
  }
  return products;
}

export const PRODUCTS: Product[] = build();

export const ALL_BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** 할인 적용가 (100원 단위 절사) */
export function salePrice(p: Product): number {
  return Math.floor((p.price * (100 - p.discountRate)) / 100 / 100) * 100;
}
