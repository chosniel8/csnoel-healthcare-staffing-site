import { cn } from "@/lib/utils";

type CSNoelEmblemProps = {
  className?: string;
  title?: string;
};

/**
 * Exact emblem geometry and colors from the original
 * chosniel8/csnoel-healthcare-staffing-site GitHub HTML.
 */
export function CSNoelEmblem({ className, title }: CSNoelEmblemProps) {
  const labelled = Boolean(title);

  return (
    <svg
      viewBox="0 0 80 80"
      role={labelled ? "img" : undefined}
      aria-label={title}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      className={cn("shrink-0", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <rect x="22" y="10" width="20" height="60" rx="4" fill="#2E8FD8" />
      <rect x="10" y="22" width="44" height="20" rx="4" fill="#2E8FD8" />
      <rect x="22" y="10" width="10" height="60" rx="4" fill="#0A3A6E" opacity="0.55" />
      <rect x="10" y="22" width="44" height="10" rx="4" fill="#0A3A6E" opacity="0.45" />
      <circle cx="58" cy="18" r="7" fill="#3AAA35" />
      <path d="M18 62 Q40 75 64 52" stroke="#3AAA35" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

type CSNoelWordmarkProps = {
  className?: string;
  emblemClassName?: string;
  tone?: "default" | "light";
};

export function CSNoelWordmark({ className, emblemClassName, tone = "default" }: CSNoelWordmarkProps) {
  const wordmarkTone = tone === "light" ? "text-white" : "text-[#0A3A6E]";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <CSNoelEmblem className={cn("size-9", emblemClassName)} />
      <span className={cn("font-[Poppins] text-[1.15rem] font-extrabold tracking-[-0.04em]", wordmarkTone)}>
        CS<span className="text-[#3AAA35]">Noel</span>
      </span>
    </span>
  );
}
