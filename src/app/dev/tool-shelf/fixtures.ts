import type { ToolGroup } from "@/components/tool-shelf";

/**
 * Worst-case data for the tool shelf, shaped like its own `GROUPS`. Every value
 * is a real product name or a shape one produces (a scoped package, a long
 * AWS service name), never filler. Rows are mixed on purpose: the long label
 * sits next to the one-letter one, a mark next to no mark.
 */
const t = (label: string, mark?: ToolGroup["rows"][number]["mark"]) => ({
  label,
  mark,
});

const MANY = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Elixir",
  "Ruby",
  "PHP",
  "Kotlin",
  "Swift",
  "Dart",
  "Zig",
  "Node.js",
  "Deno",
  "Bun",
  "NestJS",
  "Hono",
  "Express",
  "Fastify",
  "FastAPI",
  "Django",
  "Flask",
  "Next.js",
  "Remix",
  "Astro",
  "SvelteKit",
  "Nuxt",
  "React",
  "Vue",
  "Solid",
  "Angular",
  "Qwik",
  "Postgres",
  "MySQL",
  "SQLite",
  "MongoDB",
  "Redis",
  "Valkey",
  "ClickHouse",
  "Kafka",
  "RabbitMQ",
  "NATS",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Pulumi",
].map((label) => t(label));

export const WORST: ToolGroup[] = [
  {
    title:
      "Core stack, services and everything else I reach for when a client asks",
    lede: "What most of my work runs on, plus the things around it that change every quarter and that I would rather not list one at a time on a phone.",
    rows: [
      {
        tools: [
          t("C", "javascript"),
          t("Go"),
          t("TypeScript", "typescript"),
          t("@modelcontextprotocol/server-filesystem"),
          t("Amazon Elastic Container Registry"),
          t("Azure OpenAI Service"),
          t("Next.js", "nextdotjs"),
          t("PostgreSQL with pgvector and pg_trgm extensions"),
          t("LangChain", "langchain"),
          t("AWS Lambda"),
        ],
      },
    ],
  },
  {
    title: "One",
    lede: "A group with a single tool.",
    rows: [{ tools: [t("Docker", "docker")] }],
  },
  {
    title: "Everything at once",
    lede: "Forty-six chips in one row.",
    rows: [
      { tools: MANY },
      {
        label:
          "Amazon Web Services Elastic Compute Cloud and related networking",
        mark: "amazonwebservices",
        tools: [t("EC2", "amazonec2"), t("VPC and PrivateLink endpoints")],
      },
      { label: "Empty row", mark: "googlecloud", tools: [] },
    ],
  },
];

export const ONE: ToolGroup[] = [
  {
    title: "Core stack",
    lede: "One group, one tool.",
    rows: [{ tools: [t("Python", "python")] }],
  },
];

export const EMPTY: ToolGroup[] = [];
