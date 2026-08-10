import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * shadcn's `Input`, with its colour classes brought onto the site's tokens.
 *
 * Three changes from what the registry ships, and each is a rule from
 * `globals.css` rather than a preference:
 *
 * - **The `dark:` overrides are gone.** #11 forbids a manual `dark:` colour on
 *   a component: the theme is chosen by the reader's system and every value
 *   already resolves per ground, so a second set of colours here would be a
 *   second source of truth that only one theme ever reads.
 * - **Invalid reads the error tokens.** `--error-line` is the border and
 *   `--error-bg` the fill, both measured in #20 and #21. The fill is only
 *   correct because this form sits on the page ground — `--error-bg` is 1.01:1
 *   on the raised surface, so an input inside a card would need a different
 *   answer.
 * - **Disabled is a token pair, not an opacity.** 50% of a ramp this tight
 *   lands under any usable floor and cannot be measured; `--foreground-
 *   disabled` and `--action-disabled` both clear 3:1 and can (#20).
 *
 * There is no focus ring here. `globals.css` states one for every interactive
 * element, in the accent, which belongs to the ground — so it is already right
 * in both themes and inside a flipped row. A second ring on this element would
 * be the same job done twice, differently.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 border border-input bg-transparent px-3 py-2 text-body transition-colors placeholder:text-foreground-label",
        "disabled:cursor-not-allowed disabled:border-action-disabled disabled:text-foreground-disabled",
        "aria-invalid:border-error-line aria-invalid:bg-error-bg",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
