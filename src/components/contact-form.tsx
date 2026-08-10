"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type ContactMessage,
  type ContactResponse,
  contactSchema,
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
} from "@/lib/contact";
import { ACTION_CLASS, CONTACT_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The contact form (#30).
 *
 * It validates against `contactSchema` — the same object the Route Handler
 * validates against, imported rather than restated (#11). That is the point of
 * the shared schema: the two sides cannot disagree about what a valid message
 * is, because there is only one answer to disagree with.
 *
 * The two invisible checks it carries are the honeypot below and the elapsed
 * time from the moment this component mounted. Neither is in the schema, and
 * neither is ever shown — see `src/lib/contact.ts` for why they are split out.
 * Because the form is hydrated on scroll, "mounted" is the moment the reader
 * reached the footer, which is the moment the clock should start anyway.
 *
 * There is one terminal state and the failure names the fallback. A visitor
 * who is told a send failed and nothing else has lost the message and the
 * route to send it (#24, stories 31 and 32).
 */

type Status = "editing" | "sending" | "sent" | "failed";

/** What a field hands its control so the two agree about being wrong. */
type ControlProps = {
  id: string;
  "aria-invalid"?: "true";
  "aria-describedby"?: string;
};

/**
 * One field: its label, its control, and the message that appears next to it.
 *
 * The control is passed in rather than chosen here, because the three fields
 * genuinely differ — two inputs and a textarea, each with its own autofill
 * hint. What does NOT differ is the wiring, and written out three times that
 * was three chances to point `aria-describedby` at an id that is not on the
 * page: the failure only a screen reader meets, and the one nothing else
 * notices. Derived from the field name in one place, the id and the message
 * that names it cannot drift apart.
 */
function ContactField({
  name,
  label,
  error,
  control,
}: {
  name: keyof ContactMessage;
  label: string;
  error?: { message?: string };
  control: (props: ControlProps) => ReactNode;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const invalid = Boolean(error);

  return (
    <Field data-invalid={invalid ? "true" : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {control({
        id,
        "aria-invalid": invalid ? "true" : undefined,
        "aria-describedby": invalid ? errorId : undefined,
      })}
      <FieldError errors={[error]} id={errorId} />
    </Field>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("editing");

  // Set on the client at first render, which — because this component is
  // loaded on scroll — is when the reader arrived at the footer.
  const mountedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ContactMessage>({
    resolver: zodResolver(contactSchema),
    // Quiet until a field has been left, then live. Validating on every
    // keystroke marks a field wrong while it is still being typed.
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("sending");

    const answer = await post({
      ...values,
      [HONEYPOT_FIELD]: honeypot.current?.value ?? "",
      [ELAPSED_FIELD]: Date.now() - mountedAt.current,
    });

    if (answer?.ok) {
      setStatus("sent");
      return;
    }

    // The server found something the client's copy of the schema did not —
    // which means the two are out of step, or the body was tampered with on
    // the way. Either way the field it names is the useful thing to show.
    if (answer?.reason === "invalid") {
      for (const [field, message] of Object.entries(answer.fieldErrors)) {
        setError(field as keyof ContactMessage, { message });
      }
      setStatus("editing");
      return;
    }

    setStatus("failed");
  });

  if (status === "sent") {
    return (
      <p className="border border-border-strong px-5 py-4" role="status">
        Sent. A reply will come from {CONTACT_EMAIL}.
      </p>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit}>
      <FieldGroup>
        <ContactField
          control={(props) => (
            <Input autoComplete="name" {...props} {...register("name")} />
          )}
          error={errors.name}
          label="Name"
          name="name"
        />

        <ContactField
          control={(props) => (
            <Input
              autoComplete="email"
              inputMode="email"
              type="email"
              {...props}
              {...register("email")}
            />
          )}
          error={errors.email}
          label="Email"
          name="email"
        />

        <ContactField
          control={(props) => (
            <Textarea rows={6} {...props} {...register("message")} />
          )}
          error={errors.message}
          label="Message"
          name="message"
        />
      </FieldGroup>

      {/* The honeypot. Off-screen rather than `display: none`, hidden from
          assistive technology, and out of the tab order — so nobody using the
          page any way at all can reach it, and a form-filler working from the
          markup still finds a field named `company` worth completing.

          It is a plain ref rather than a registered field: the schema has three
          fields and this is not one of them, and adding it there to make the
          form's shape match would put a rule with no message next to three
          that have one. */}
      <div aria-hidden="true" className="absolute left-[-9999px] w-px">
        <label htmlFor="contact-company">Company</label>
        <input
          autoComplete="off"
          defaultValue=""
          id="contact-company"
          name={HONEYPOT_FIELD}
          ref={honeypot}
          tabIndex={-1}
          type="text"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button
          className={cn(
            ACTION_CLASS,
            "disabled:cursor-not-allowed disabled:border-action-disabled disabled:text-foreground-disabled disabled:hover:bg-transparent",
          )}
          disabled={status === "sending"}
          type="submit"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        {status === "failed" ? (
          <p className="text-error text-sm" role="alert">
            That did not send. The address above still works.
          </p>
        ) : null}
      </div>
    </form>
  );
}

/**
 * `undefined` when the route could not be reached or did not answer JSON,
 * which the caller treats exactly as a failed send. From the visitor's side
 * they are the same event: the message did not go, and the address is the way
 * round it.
 */
async function post(body: unknown): Promise<ContactResponse | undefined> {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    return (await response.json()) as ContactResponse;
  } catch {
    return undefined;
  }
}
