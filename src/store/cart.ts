import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  size: string;
  quantity: number;
  checked: boolean;
}

interface CartState {
  items: CartItem[];
  addItem: (productId: string, size: string, quantity: number) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  toggleChecked: (productId: string, size: string) => void;
  setAllChecked: (checked: boolean) => void;
  removeChecked: () => void;
}

const same = (i: CartItem, productId: string, size: string) =>
  i.productId === productId && i.size === size;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId, size, quantity) =>
        set((s) => {
          const existing = s.items.find((i) => same(i, productId, size));
          if (existing) {
            return {
              items: s.items.map((i) =>
                same(i, productId, size)
                  ? { ...i, quantity: i.quantity + quantity, checked: true }
                  : i,
              ),
            };
          }
          return { items: [...s.items, { productId, size, quantity, checked: true }] };
        }),
      setQuantity: (productId, size, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            same(i, productId, size) ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        })),
      removeItem: (productId, size) =>
        set((s) => ({ items: s.items.filter((i) => !same(i, productId, size)) })),
      toggleChecked: (productId, size) =>
        set((s) => ({
          items: s.items.map((i) =>
            same(i, productId, size) ? { ...i, checked: !i.checked } : i,
          ),
        })),
      setAllChecked: (checked) =>
        set((s) => ({ items: s.items.map((i) => ({ ...i, checked })) })),
      removeChecked: () =>
        set((s) => ({ items: s.items.filter((i) => !i.checked) })),
    }),
    { name: "musinsa-cart" },
  ),
);
