/**
 * PROTOTYPE — throwaway. Four visual takes of the home page, switchable via
 * `?variant=A|B|C|D`. Real copy throughout (see src/prototype/content.ts).
 *
 * The WIP landing page this replaced still lives on `main`.
 */

import { Suspense } from "react";

import { PrototypeSwitcher } from "@/prototype/switcher";
import { VariantA } from "@/prototype/variants/a-terminal";
import { VariantB } from "@/prototype/variants/b-editorial";
import { VariantC } from "@/prototype/variants/c-product";
import { VariantD } from "@/prototype/variants/d-spec";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  const variant = (await searchParams).variant?.toUpperCase() ?? "A";

  return (
    <>
      {variant === "B" ? (
        <VariantB />
      ) : variant === "C" ? (
        <VariantC />
      ) : variant === "D" ? (
        <VariantD />
      ) : (
        <VariantA />
      )}
      <Suspense>
        <PrototypeSwitcher current={variant} />
      </Suspense>
    </>
  );
}
