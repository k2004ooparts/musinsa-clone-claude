export const FREE_SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 3000;

export function won(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}

export function shippingFee(subtotal: number): number {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FEE;
}
