import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * shadcn's `Input`, on the site's tokens.
 *
 * It always sits inside a `.paper` card, which is what makes the same field read
 * correctly on a peach sky and on the night's navy: the card resets the tokens
 * to day ink on cream, so nothing here ever has to know the hour.
 *
 * - Invalid reads the error tokens, a warm tint with a red edge.
 * - Disabled is a token pair, not an opacity.
 * - There is no focus ring here. `globals.css` states one for every
 *   interactive element, in coral, so a second would be the same job twice.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-[var(--radius)] border-2 border-input bg-background-raised px-3 py-2.5 text-body transition-colors placeholder:text-foreground-label",
        "disabled:cursor-not-allowed disabled:border-action-disabled disabled:text-foreground-disabled",
        "aria-invalid:border-error-line aria-invalid:bg-error-bg",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
