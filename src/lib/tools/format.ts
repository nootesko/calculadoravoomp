const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const BRL_CENTS = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const NUMBER = new Intl.NumberFormat("pt-BR");

export const money = (value: number) => BRL.format(Math.round(value));
export const moneyCents = (value: number) => BRL_CENTS.format(value);
export const number = (value: number) => NUMBER.format(Math.round(value));

export const percent = (value: number, digits = 1) =>
  `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;

/** A 0..1 ratio rendered as a percentage. */
export const ratio = (value: number, digits = 1) => percent(value * 100, digits);

export const range = (min: number, max: number, render: (n: number) => string) =>
  `${render(min)} — ${render(max)}`;
