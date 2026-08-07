/**
 * PROTOTYPE — throwaway route for #17. Three takes of the DETAIL pages,
 * switchable via `?variant=A|B|C`, across both page kinds via `?page=work|oss`.
 *
 * A throwaway route rather than an adjustment to an existing one, because
 * neither `/work/[slug]` nor `/open-source/[slug]` exists yet — the map ends
 * at a spec, so nothing has been built.
 */

import { Suspense } from "react";

import { DetailA } from "@/prototype/detail/a-artifact-first";
import { DetailB } from "@/prototype/detail/b-the-turn";
import { DetailC } from "@/prototype/detail/c-sticky-reference";
import { DetailSwitcher } from "@/prototype/detail/switcher";

export default async function DetailPrototypePage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const variant = sp.variant?.toUpperCase() ?? "A";
  const page = sp.page === "oss" ? "oss" : "work";

  return (
    <>
      {variant === "B" ? (
        <DetailB page={page} />
      ) : variant === "C" ? (
        <DetailC page={page} />
      ) : (
        <DetailA page={page} />
      )}
      <Suspense>
        <DetailSwitcher current={variant} page={page} />
      </Suspense>
    </>
  );
}
