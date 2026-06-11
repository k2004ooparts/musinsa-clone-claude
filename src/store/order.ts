import { create } from "zustand";

export interface OrderInfo {
  orderNo: string;
  receiver: string;
  address: string;
  total: number;
  itemCount: number;
}

interface OrderState {
  lastOrder: OrderInfo | null;
  setOrder: (order: OrderInfo) => void;
}

// 주문 완료 화면에 보여줄 직전 주문 정보 (데모용 — 새로고침하면 사라진다)
export const useOrderStore = create<OrderState>((set) => ({
  lastOrder: null,
  setOrder: (order) => set({ lastOrder: order }),
}));
