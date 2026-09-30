import type { Metadata } from "next";

import { ToolsProvider } from "@/lib/tools/store";

export const metadata: Metadata = {
  title: "Marketing de Funil (Calculadoras VOOMP)",
  description:
    "Calculadoras e diagnósticos gratuitos para quem vende conhecimento online: precificação, modelo de lançamento, potencial acadêmico, conversão e taxas de plataforma.",
};

/**
 * Only the shared state lives here. The hub home brings its own site chrome;
 * each calculator renders as a full-screen shell with no navigation at all.
 */
export default function FerramentasLayout({ children }: LayoutProps<"/ferramentas">) {
  return <ToolsProvider>{children}</ToolsProvider>;
}
