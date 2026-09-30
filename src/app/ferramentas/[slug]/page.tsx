import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CalculatorRunner } from "@/components/tools/calculator-runner";
import { CALCULATORS, getCalculator } from "@/lib/tools/registry";

export function generateStaticParams() {
  return CALCULATORS.map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/ferramentas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) return { title: "Ferramenta não encontrada" };

  return {
    title: `${calculator.name} — Calculadoras VOOMP`,
    description: calculator.description,
  };
}

export default async function CalculatorPage({ params }: PageProps<"/ferramentas/[slug]">) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();

  return (
    <div className="bg-white">
      <CalculatorRunner slug={calculator.slug} />
    </div>
  );
}
