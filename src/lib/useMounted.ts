"use client";

import { useEffect, useState } from "react";

/**
 * localStorage에 persist된 zustand 상태는 SSR HTML과 다를 수 있어서,
 * 마운트 후에만 그리도록 가드해 hydration 불일치를 막는다.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
