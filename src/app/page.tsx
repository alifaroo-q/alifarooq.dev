const links = [
  { label: "GitHub", href: "https://github.com/alifaroo-q" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/alifaroo-q" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-10 px-6 py-24">
      <div className="flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase opacity-70">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        Work in progress
      </div>

      <div className="space-y-5">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Ali Farooq
        </h1>
        <p className="text-lg leading-relaxed text-pretty opacity-80">
          Full stack engineer. I build TypeScript systems that make failure
          explicit — and try to get the compiler to enforce it.
        </p>
        <p className="leading-relaxed text-pretty opacity-60">
          This site is being built in the open. Case studies, open source write-ups,
          and a way to reach me are on the way.
        </p>
      </div>

      <nav className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-accent decoration-2 underline-offset-4 transition-opacity hover:opacity-60"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <footer className="font-mono text-xs opacity-40">
        alifarooq.dev — {new Date().getFullYear()}
      </footer>
    </main>
  );
}
