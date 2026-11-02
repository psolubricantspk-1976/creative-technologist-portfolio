/**
 * Evaluation program catalogue.
 *
 * Single source of truth for the three homepage programs: their rules, their
 * reward split and the fee at each account size. The homepage selector and the
 * /start checkout both read from here, so a price only has to change once.
 */

export type ProgramId = "spark" | "forge" | "apex";
export type SizeKey = "10k" | "25k" | "50k" | "100k" | "200k";

export type Program = {
  id: ProgramId;
  name: string;
  type: string;
  tagline: string;
  split: string;
  target: string;
  daily: string;
  max: string;
  minDays: string;
  popular?: boolean;
  fees: Record<SizeKey, string>;
};

export const SIZES: Array<{ key: SizeKey; label: string }> = [
  { key: "10k", label: "$10K" },
  { key: "25k", label: "$25K" },
  { key: "50k", label: "$50K" },
  { key: "100k", label: "$100K" },
  { key: "200k", label: "$200K" },
];

export const PROGRAMS: Program[] = [
  {
    id: "spark",
    name: "Spark",
    type: "1-Step",
    tagline:
      "One target, one phase. The shortest route from evaluation to a simulated funded account.",
    split: "80%",
    target: "8%",
    daily: "4%",
    max: "8%",
    minDays: "3 trading days",
    fees: {
      "10k": "$59",
      "25k": "$119",
      "50k": "$199",
      "100k": "$329",
      "200k": "$549",
    },
  },
  {
    id: "forge",
    name: "Forge",
    type: "2-Step",
    tagline:
      "The balanced two-phase evaluation. Room to build a track record without a daily loss ceiling that punishes a bad open.",
    split: "90%",
    target: "8% / 5%",
    daily: "5%",
    max: "10%",
    minDays: "None",
    popular: true,
    fees: {
      "10k": "$89",
      "25k": "$169",
      "50k": "$269",
      "100k": "$439",
      "200k": "$729",
    },
  },
  {
    id: "apex",
    name: "Apex",
    type: "1-Step Pro",
    tagline:
      "Tighter risk, higher reward split. Built for experienced operators with a repeatable process.",
    split: "92%",
    target: "6%",
    daily: "3%",
    max: "6%",
    minDays: "None",
    fees: {
      "10k": "$129",
      "25k": "$239",
      "50k": "$379",
      "100k": "$599",
      "200k": "$999",
    },
  },
];

export const DEFAULT_PROGRAM: ProgramId = "forge";
export const DEFAULT_SIZE: SizeKey = "50k";

export function programById(id: string | undefined): Program {
  return (
    PROGRAMS.find((program) => program.id === id) ??
    PROGRAMS.find((program) => program.id === DEFAULT_PROGRAM) ??
    PROGRAMS[0]
  );
}

export function sizeByKey(key: string | undefined) {
  return (
    SIZES.find((size) => size.key === key) ??
    SIZES.find((size) => size.key === DEFAULT_SIZE) ??
    SIZES[0]
  );
}

/** Fee for a program at a given size, e.g. "$269". */
export function priceFor(program: Program, sizeKey: string): string {
  return program.fees[sizeByKey(sizeKey).key];
}
