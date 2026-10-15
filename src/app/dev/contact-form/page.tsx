import { notFound } from "next/navigation";
import { ContactForm, type Status } from "@/components/contact-form";
import { AT_LIMIT, OVER_LIMIT } from "./fixtures";

/**
 * Dev-only: the contact form against its schema's limits, behind a toggle.
 * `?data=worst|over|sending|sent`; no param is the empty form. Not found in
 * production. "Failed" needs no fixture: with no Resend key the route answers
 * 502, so submitting `worst` here shows it.
 */
const STATES = [
  ["demo", "Empty"],
  ["worst", "At limits"],
  ["over", "Over limits"],
  ["sending", "Sending"],
  ["sent", "Sent"],
] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { data = "demo" } = await searchParams;
  const values =
    data === "worst" ? AT_LIMIT : data === "over" ? OVER_LIMIT : undefined;
  const status: Status =
    data === "sent" ? "sent" : data === "sending" ? "sending" : "editing";
  return (
    <main className="hour hour-night pt-12 pb-32" id="main">
      <div className="wrap">
        <div className="paper mx-auto max-w-[34rem] p-6 md:p-8">
          <ContactForm
            defaultValues={values}
            initialStatus={status}
            key={data}
          />
        </div>
      </div>
      <nav
        aria-label="Data"
        className="fixed bottom-3 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-lg bg-neutral-300 p-1 font-sans text-neutral-900 text-xs"
      >
        {STATES.map(([key, label]) => (
          <a
            aria-current={data === key ? "page" : undefined}
            className={`rounded-md px-3 py-2 ${data === key ? "bg-white shadow" : ""}`}
            href={`?data=${key}`}
            key={key}
          >
            {label}
          </a>
        ))}
      </nav>
    </main>
  );
}
