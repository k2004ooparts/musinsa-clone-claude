import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "MUSINSA — 패션 이커머스 데모",
  description: "무신사 스타일 패션 이커머스 MVP 데모",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-neutral-900">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20">{children}</main>
        <footer className="border-t border-neutral-200 py-10 text-center text-xs text-neutral-400">
          MUSINSA STYLE DEMO — 실제 쇼핑몰이 아닌 학습/포트폴리오용 데모입니다.
        </footer>
      </body>
    </html>
  );
}
