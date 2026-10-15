import type { HowContent, Rule } from "@/components/how-i-work";
import { CLOSING, LOOP, RULES, STANCE, SUB } from "@/components/how-i-work";

/**
 * Worst-case copy for the How I work section, shaped like its own content.
 * Long strings are the length a paragraph takes when a client's constraints
 * are written out; short ones are one word.
 */
const step = (step: string, line: string) => ({ step, line });

const LONG_RULE: Rule = {
  title:
    "I name every error a function can return, and I refuse to let an exception cross a module boundary unannounced.",
  line: "I model the errors I expect as values with Result and Option types, and I try to list all of them. Today I use Effect TS for this, and before that I used a hand-rolled Result type that I later published. Rules that must hold live in the database as constraints, triggers and row-level security, so that no code path, however it was written, can break them. When a rule changes, the migration and the type change in the same pull request.",
  links: [
    { href: "/work/result-kit", label: "result-kit" },
    { href: "/work/numlix", label: "Numlix ledger" },
    {
      href: "/work/hcpa-email",
      label: "@zireal/result-kit-eslint-plugin-no-unhandled-result",
    },
    { href: "/work/voxena", label: "Voxena" },
    {
      href: "/work/tenley",
      label: "Tenley billing migration to Stripe in 10 phases",
    },
  ],
};

const SHORT_RULE: Rule = { title: "Ship.", line: "Yes.", links: [] };

export const WORST: HowContent = {
  stance:
    "I own the system around the model: the data, the queues, the guards, the retries, the audit trail, the on-call rota and the person who checks its work before anything reaches a client, a patient or a customer's bank account.",
  sub: "I work close to the client for months, not weeks. I learn how their business runs, which spreadsheet is the real source of truth and who is quietly doing the work the software was meant to do, and then I build a tool that fits it rather than one that asks them to change.",
  loop: [
    step(
      "Ask",
      "I sit with the client or product owner and ask questions until I can write the requirement down in plain words, then I read it back to them and wait for the part they correct.",
    ),
    step("Agree", "Yes."),
    step(
      "De-risk, measure and iterate with the client's operations team",
      "I find the part most likely to fail and test it first. I design the data before anything else, then write the migration, then the types, then the one query the whole product depends on, and I run that query against a copy of production before I write a single screen.",
    ),
    step(
      "Spike",
      "A spike is a quick, rough build to learn something. I build two or three and keep the best idea.",
    ),
    step("Benachrichtigungseinstellungen", "Compound."),
    step(
      "Ship",
      "I put it in front of the client early and change it fast from what they say.",
    ),
    step(
      "Observe",
      "Logs, traces and one dashboard that a person who is not me can read.",
    ),
    step(
      "Hand over",
      "A runbook, a recorded walkthrough and the decisions written down.",
    ),
  ],
  closing:
    "Because code is cheap, I can try ideas that cost too much to try before, and I can throw away the ones that do not work without anyone having to argue about the sunk cost.",
  rules: [
    LONG_RULE,
    SHORT_RULE,
    RULES[1],
    RULES[2],
    RULES[3],
    LONG_RULE,
    SHORT_RULE,
  ],
};

export const ONE: HowContent = {
  stance: STANCE,
  sub: SUB,
  loop: [LOOP[0]],
  closing: CLOSING,
  rules: [RULES[0]],
};

export const EMPTY: HowContent = {
  stance: STANCE,
  sub: SUB,
  loop: [],
  closing: CLOSING,
  rules: [],
};
