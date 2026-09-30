"use client";

import { Lock } from "lucide-react";

import { SelectCards, TextInput } from "@/components/tools/fields";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/lib/tools/options";
import type { ProducerProfile } from "@/lib/tools/types";

/**
 * Contact capture, shown only once and only right before a result — never as
 * the entry point of a tool.
 */
export function LeadCapture({
  profile,
  onAnswer,
  onSubmit,
  onBack,
}: {
  profile: ProducerProfile;
  onAnswer: (field: keyof ProducerProfile, value: unknown) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const ready =
    Boolean(profile.firstName?.trim()) &&
    Boolean(profile.email?.trim()) &&
    /\S+@\S+\.\S+/.test(profile.email ?? "") &&
    Boolean(profile.whatsapp?.trim());

  return (
    <div>
      <h2 className="text-h1 text-ink">Seu diagnóstico está pronto.</h2>
      <p className="mt-3 text-body text-ink-muted">
        Preencha seus dados para visualizar o resultado completo.
      </p>

      <form
        className="mt-8 flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (ready) onSubmit();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome">
            <TextInput
              value={profile.firstName}
              autoComplete="given-name"
              placeholder="Seu nome"
              onChange={(v) => onAnswer("firstName", v)}
            />
          </Field>
          <Field label="Sobrenome" optional>
            <TextInput
              value={profile.lastName}
              autoComplete="family-name"
              placeholder="Seu sobrenome"
              onChange={(v) => onAnswer("lastName", v)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail">
            <TextInput
              type="email"
              value={profile.email}
              autoComplete="email"
              placeholder="voce@empresa.com.br"
              onChange={(v) => onAnswer("email", v)}
            />
          </Field>
          <Field label="WhatsApp">
            <TextInput
              type="tel"
              value={profile.whatsapp}
              autoComplete="tel"
              placeholder="(11) 90000-0000"
              onChange={(v) => onAnswer("whatsapp", v)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Empresa ou marca" optional>
            <TextInput
              value={profile.company}
              autoComplete="organization"
              placeholder="Nome da sua marca"
              onChange={(v) => onAnswer("company", v)}
            />
          </Field>
          <Field label="Instagram ou site" optional>
            <TextInput
              value={profile.handle}
              placeholder="@seuperfil"
              onChange={(v) => onAnswer("handle", v)}
            />
          </Field>
        </div>

        <Field label="Qual sua função?" optional>
          <SelectCards
            name="role"
            options={ROLES}
            value={profile.role}
            columns={3}
            onChange={(v) => onAnswer("role", v)}
          />
        </Field>

        <p className="flex items-start gap-2 text-caption text-ink-muted">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Seus dados ficam salvos apenas neste navegador durante este protótipo.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="brand" size="pill-lg" disabled={!ready}>
            Ver meu diagnóstico
          </Button>
          <Button type="button" variant="ghost" size="pill" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-body-sm font-semibold text-ink">
        {label}
        {optional ? (
          <span className="ml-2 text-caption font-normal text-ink-muted">(opcional)</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}
