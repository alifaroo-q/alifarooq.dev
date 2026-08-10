import type * as React from "react";

import { cn } from "@/lib/utils";

/** shadcn's `Textarea`, on the site's tokens for the reasons `input.tsx` gives. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-32 w-full border border-input bg-transparent px-3 py-2 text-body transition-colors placeholder:text-foreground-label",
        "disabled:cursor-not-allowed disabled:border-action-disabled disabled:text-foreground-disabled",
        "aria-invalid:border-error-line aria-invalid:bg-error-bg",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
