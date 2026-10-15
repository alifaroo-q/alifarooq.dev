import { BRAND_MARKS } from "@/lib/brand-marks";

type Tool = {
  label: string;
  mark?: keyof typeof BRAND_MARKS;
};

type Row = {
  /** Names a sub-group, such as a cloud, above its chips. */
  label?: string;
  mark?: Tool["mark"];
  tools: Tool[];
};

const t = (label: string, mark?: Tool["mark"]): Tool => ({ label, mark });

export type ToolGroup = { title: string; lede: string; rows: Row[] };

const GROUPS: ToolGroup[] = [
  {
    title: "Core stack",
    lede: "What most of my work runs on.",
    rows: [
      {
        tools: [
          t("TypeScript", "typescript"),
          t("JavaScript", "javascript"),
          t("Python", "python"),
          t("Node.js", "nodedotjs"),
          t("NestJS", "nestjs"),
          t("Hono", "hono"),
          t("FastAPI", "fastapi"),
          t("Effect TS", "effect"),
          t("Next.js", "nextdotjs"),
          t("React", "react"),
          t("LangChain", "langchain"),
          t("Postgres", "postgresql"),
          t("MySQL", "mysql"),
          t("Redis", "redis"),
          t("Docker", "docker"),
        ],
      },
    ],
  },
  {
    title: "Services and cloud",
    lede: "What I plug in around it.",
    rows: [
      {
        tools: [
          t("Vapi", "vapi"),
          t("Twilio", "twilio"),
          t("ElevenLabs", "elevenlabs"),
          t("pgvector"),
          t("Pinecone", "pinecone"),
          t("BullMQ"),
          t("GitHub Actions", "githubactions"),
        ],
      },
      {
        label: "AWS",
        mark: "amazonwebservices",
        tools: [
          t("EC2", "amazonec2"),
          t("S3", "amazons3"),
          t("IAM", "amazoniam"),
          t("ElastiCache", "amazonelasticache"),
          t("RDS", "amazonrds"),
          t("SQS", "amazonsqs"),
          t("SNS"),
        ],
      },
      {
        label: "Google Cloud",
        mark: "googlecloud",
        tools: [
          t("Gmail Pub/Sub", "googlepubsub"),
          t("Google OAuth", "google"),
          t("Maps API", "googlemaps"),
          t("Places API", "googlemaps"),
        ],
      },
    ],
  },
  {
    title: "AI I code with",
    lede: "Claude Code is my main one, day to day.",
    rows: [
      {
        label: "Main",
        tools: [
          t("Claude Code", "claude"),
          t("GitHub Copilot", "githubcopilot"),
          t("Cursor", "cursor"),
        ],
      },
      {
        label: "Less often",
        tools: [
          t("OpenCode", "opencode"),
          t("Codex", "openai"),
          t("Pi", "pi"),
          t("Antigravity", "antigravity"),
        ],
      },
    ],
  },
];

function Chip({ tool }: { tool: Tool }) {
  return (
    <li className="chip gap-2 px-3 py-1.5 text-sm md:text-[0.9375rem]">
      {tool.mark ? (
        <svg
          aria-hidden="true"
          className="mt-[calc((1lh-1rem)/2)] size-4 shrink-0"
          fill="currentColor"
          focusable="false"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={BRAND_MARKS[tool.mark].d} />
        </svg>
      ) : null}
      {tool.label}
    </li>
  );
}

function ChipRow({ row }: { row: Row }) {
  if (row.tools.length === 0) return null;
  return (
    <div>
      {row.label ? (
        <p className="mb-2 flex items-center gap-2 font-semibold text-foreground-muted text-sm">
          {row.mark ? (
            <svg
              aria-hidden="true"
              className="size-4 shrink-0"
              fill="currentColor"
              focusable="false"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={BRAND_MARKS[row.mark].d} />
            </svg>
          ) : null}
          {row.label}
        </p>
      ) : null}
      <ul className="flex flex-wrap gap-3 md:gap-4">
        {row.tools.map((tool) => (
          <Chip key={tool.label} tool={tool} />
        ))}
      </ul>
    </div>
  );
}

export function ToolShelf({ groups = GROUPS }: { groups?: ToolGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <div className="wrap mt-group grid gap-10 lg:gap-12" data-land>
      {groups.map((group) => (
        <section
          className="grid gap-4 md:grid-cols-[14rem_1fr] md:gap-10"
          key={group.title}
        >
          <header>
            <h3 className="font-bold font-display text-[clamp(1.375rem,2.2vw,1.75rem)] leading-[1.15] tracking-tight">
              {group.title}
            </h3>
            <p className="mt-1 text-foreground-muted text-sm">{group.lede}</p>
          </header>
          <div className="grid gap-5">
            {group.rows.map((row) => (
              <ChipRow key={row.label ?? group.title} row={row} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
