import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faq } from "@/lib/content";

export function Faq() {
  return (
    <section id="faq" className="bg-surface-muted py-16 lg:py-[96px]">
      <div className="container-voomp grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-4">{faq.eyebrow}</p>
          <h2 className="text-h1 text-ink">
            {faq.title.map((line) => (
              <span key={line} className="block max-lg:inline">
                {line}{" "}
              </span>
            ))}
          </h2>
          <Button asChild variant="brand" size="pill" className="mt-7">
            <Link href={faq.cta.href}>{faq.cta.label}</Link>
          </Button>
        </div>

        {/* The Figma mock shows every answer open, so all items start expanded. */}
        <Accordion
          type="multiple"
          defaultValue={faq.items.map((item) => item.question)}
          className="w-full"
        >
          {faq.items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-left text-base font-normal text-ink sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-line text-body text-ink-muted">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
