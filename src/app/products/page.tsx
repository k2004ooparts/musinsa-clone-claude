import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

// 정적 export(GitHub Pages)에서는 서버가 없어 쿼리스트링을 빌드 시점에 읽을 수
// 없으므로, 필터/정렬/검색은 전부 클라이언트에서 처리한다.
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-6" />}>
      <ProductsClient />
    </Suspense>
  );
}
