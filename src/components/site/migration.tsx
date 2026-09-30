import { CreatorPhoto } from "@/components/site/creator-photo";
import { migration } from "@/lib/content";

export function Migration() {
  return (
    <section className="bg-white py-14 lg:py-[34px]">
      <div className="container-voomp grid items-center gap-16 lg:grid-cols-[561fr_592fr] lg:gap-16">
        <CreatorPhoto
          src="/images/feature-migracao.png"
          alt="Educador apresentando seu curso, com selo de validação oficial"
        />

        <div>
          <h3 className="text-h1 text-ink">
            {migration.title.map((line) => (
              <span key={line} className="block max-lg:inline">
                {line}{" "}
              </span>
            ))}
          </h3>

          <dl className="mt-10">
            {migration.rows.map((row, i) => (
              <div key={row.label} className={i > 0 ? "mt-6 border-t border-border pt-6" : ""}>
                <dt className="text-h3 text-ink">{row.label}</dt>
                <dd className="mt-3 text-body text-ink-muted">
                  &ldquo;{row.quote}&rdquo;
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
