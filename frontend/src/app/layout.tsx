import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "KeepUnB — Sistema de Manutenção",
  description: "Centralização e automação da gestão de solicitações de manutenção da UnB.",
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
      <body>
        {children}
      </body>
    </html>
  );
}
