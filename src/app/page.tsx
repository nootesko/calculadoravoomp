import { Academic } from "@/components/site/academic";
import { Cases } from "@/components/site/cases";
import { CognaGroup } from "@/components/site/cogna-group";
import { CognaIntro } from "@/components/site/cogna-intro";
import { Entrepreneurs } from "@/components/site/entrepreneurs";
import { Faq } from "@/components/site/faq";
import { Features } from "@/components/site/features";
import { Gamification } from "@/components/site/gamification";
import { Hero } from "@/components/site/hero";
import { MarqueeBanner } from "@/components/site/marquee-banner";
import { Migration } from "@/components/site/migration";
import { Platform } from "@/components/site/platform";
import { Pricing } from "@/components/site/pricing";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Social } from "@/components/site/social";
import { Support } from "@/components/site/support";
import { Updates } from "@/components/site/updates";

/** Section order mirrors the `Home Desktop` frame in Figma, top to bottom. */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CognaIntro />
        <Entrepreneurs />
        <Platform />
        <Features />
        <Pricing />
        <Support />
        <Migration />
        <MarqueeBanner />
        <Academic />
        <Cases />
        <Gamification />
        <Updates />
        <CognaGroup />
        <Faq />
        <Social />
      </main>
      <SiteFooter />
    </>
  );
}
