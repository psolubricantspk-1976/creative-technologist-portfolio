/**
 * Payment methods offered at checkout.
 *
 * No card numbers, wallet addresses or bank details are collected or stored in
 * the browser. Each method describes how the payment is completed once the
 * order is confirmed — the desk issues the secure link, deposit address or
 * transfer details with the invoice.
 */

export type PaymentMethodId = "card" | "crypto" | "bank";

export type PaymentMethod = {
  id: PaymentMethodId;
  name: string;
  subtitle: string;
  badges: string[];
  note: string;
  nextStep: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card",
    name: "Card",
    subtitle: "Debit or credit — instant confirmation",
    badges: ["VISA", "Mastercard", "Amex"],
    note: "Card payments run through a hosted checkout. We never see or store your card number.",
    nextStep:
      "We email you a secure, single-use checkout link. The account is issued the moment the payment clears.",
  },
  {
    id: "crypto",
    name: "Crypto",
    subtitle: "BTC · ETH · USDT · USDC",
    badges: ["BTC", "ETH", "USDT"],
    note: "Pay in crypto if your card issuer declines trading-related charges. Network fees are paid by the sender.",
    nextStep:
      "We email the exact amount and deposit address for your order. Send from a wallet you control, on the network shown on the invoice.",
  },
  {
    id: "bank",
    name: "Bank transfer",
    subtitle: "SEPA or SWIFT — best for larger sizes",
    badges: ["SEPA", "SWIFT"],
    note: "Transfers are reconciled manually, so allow one business day before your account is issued.",
    nextStep:
      "We email the beneficiary details and a payment reference. Always include the reference — it is how the transfer is matched to your order.",
  },
];

export function paymentMethodById(id: string | undefined): PaymentMethod {
  return PAYMENT_METHODS.find((method) => method.id === id) ?? PAYMENT_METHODS[0];
}
