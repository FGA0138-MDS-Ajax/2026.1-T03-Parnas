import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KeepUnB — Sistema de Manutenção FCTE/UnB",
  description: "Centralização e automação da gestão de solicitações de manutenção da FCTE/UnB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
