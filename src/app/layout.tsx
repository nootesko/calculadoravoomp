import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// The Figma file pins every text style to `typography/font family/font-sans = Inter`.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voomp.com.br"),
  title: "Voomp — A plataforma de venda e hospedagem de cursos online",
  description:
    "A plataforma do Grupo Cogna Educação para criar, vender e escalar cursos online com reconhecimento oficial.",
  openGraph: {
    title: "Voomp — A plataforma de venda e hospedagem de cursos online",
    description:
      "A plataforma do Grupo Cogna Educação para criar, vender e escalar cursos online com reconhecimento oficial.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
