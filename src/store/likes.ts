import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LikesState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useLikesStore = create<LikesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
    }),
    { name: "musinsa-likes" },
  ),
);
