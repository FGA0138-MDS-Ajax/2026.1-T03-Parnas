import type { Metadata } from "next";
import "../styles/globals.css";
import ErrorBoundary from "@/features/shared/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "KeepUnB",
  description: "Sistema de Manutenção de Infraestrutura da FCTE UnB",
  icons: {
    icon: "/favicon2.png",
    shortcut: "/favicon2.png",
    apple: "/favicon2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gradient-to-br from-[#071A3E] to-[#0D2B5E] min-h-screen">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
