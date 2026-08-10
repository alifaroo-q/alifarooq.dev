import { run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

/**
 * The elements MDX is allowed to produce, and the only place their type is
 * set. Prose is not styled at the call site, and no colour is written here —
 * every value is a token (#10, #11).
 *
 * Code is unhighlighted on purpose — see the note in `content-collections.ts`.
 * It sits on the raised ground in the body colour, which is measured.
 */
const components = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-14 text-label text-accent uppercase first:mt-0"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-10 font-medium text-foreground" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-5 max-w-measure text-foreground-muted" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul
      className="mt-5 max-w-measure list-disc space-y-2 pl-5 text-foreground-muted marker:text-foreground-label"
      {...props}
    />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol
      className="mt-5 max-w-measure list-decimal space-y-2 pl-5 text-foreground-muted marker:text-foreground-label"
      {...props}
    />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-foreground underline underline-offset-[0.2em] hover:text-accent"
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-medium text-foreground" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-5 max-w-measure border-border-strong border-l pl-5 text-foreground-muted"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="mt-6 overflow-x-auto border border-border bg-background-raised p-4 text-[0.8125rem] leading-[1.7]"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code className="text-[0.9em]" {...props} />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th
      className="border-border border-b px-3 py-2 text-label text-foreground-label uppercase"
      {...props}
    />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td
      className="border-border border-b px-3 py-2 align-top text-foreground-muted"
      {...props}
    />
  ),
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="mt-12 border-border" {...props} />
  ),
};

/**
 * Evaluates the compiled MDX at prerender time. No `"use client"`, so nothing
 * here reaches the browser bundle and there is no runtime `eval` (#12).
 */
export async function MdxContent({ code }: { code: string }) {
  const { default: Content } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return <Content components={components} />;
}
