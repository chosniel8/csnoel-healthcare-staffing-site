import { CSNoelChatWidget } from "@/components/CSNoelChatWidget";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";

type PublicShellProps = {
  children: ReactNode;
};

const navigation = [
  { label: "Find jobs", href: "/jobs" },
  { label: "For facilities", href: "/facilities" },
  { label: "About CSNoel", href: "/about" },
];

function Brand() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="CSNoel home">
      <span className="grid size-10 place-items-center rounded-[1.1rem] bg-[#0b1f3a] shadow-[0_8px_20px_rgba(11,31,58,0.17)] transition-transform duration-200 group-hover:rotate-3">
        <span className="relative block size-5">
          <span className="absolute top-0 left-1/2 h-full w-[3px] -translate-x-1/2 rounded-full bg-[#3bd6c6]" />
          <span className="absolute top-1/2 left-0 h-[3px] w-full -translate-y-1/2 rounded-full bg-[#3bd6c6]" />
        </span>
      </span>
      <span className="leading-none">
        <span className="block text-[1.15rem] font-extrabold tracking-[-0.05em] text-[#102848]">CSNoel</span>
        <span className="mt-1 block text-[0.63rem] font-extrabold tracking-[0.18em] text-[#16a6a0] uppercase">Healthcare Staffing</span>
      </span>
    </Link>
  );
}

export function PublicShell({ children }: PublicShellProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fcfdff] text-[#102848]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="container flex h-[76px] items-center justify-between gap-5">
          <Brand />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navigation.map((item) => {
              const active = item.href === "/" ? location === "/" : location.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={cn("rounded-full px-4 py-2 text-sm font-bold transition-colors", active ? "bg-sky-50 text-[#1377d5]" : "text-slate-600 hover:bg-slate-50 hover:text-[#102848]")}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden lg:block">
            <Link href="/jobs">
              <Button className="rounded-full bg-[#0b1f3a] px-5 font-bold text-white hover:bg-[#123766]">
                Explore careers <ArrowUpRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
          <button aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} onClick={() => setMobileMenuOpen((open) => !open)} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-[#102848] lg:hidden">
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {mobileMenuOpen ? (
          <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-3 shadow-lg lg:hidden">
            <nav className="container grid gap-1" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-sky-50 hover:text-[#1377d5]">
                  {item.label}
                </Link>
              ))}
              <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="mt-2 rounded-xl bg-[#0b1f3a] px-4 py-3 text-center text-sm font-bold text-white">
                Explore careers
              </Link>
            </nav>
          </div>
        ) : null}
      </header>
      <main>{children}</main>
      <footer className="border-t border-slate-200 bg-white pb-24 pt-14 sm:pb-14">
        <div className="container grid gap-10 md:grid-cols-[1.25fr_0.75fr_0.75fr]">
          <div>
            <Brand />
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600">A clear, human path to healthcare work that fits—and staffing support facilities can count on.</p>
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide text-[#102848] uppercase">Explore</h2>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              {navigation.map((item) => <Link key={item.href} href={item.href} className="hover:text-[#1377d5]">{item.label}</Link>)}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wide text-[#102848] uppercase">Start a conversation</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">Whether you’re building a care team or planning your next move, CSNoel is ready to help.</p>
            <Link href="/facilities" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1377d5] hover:text-[#0b1f3a]">Connect with CSNoel <ArrowUpRight className="size-4" /></Link>
          </div>
        </div>
        <div className="container mt-12 border-t border-slate-100 pt-5 text-xs text-slate-500">© {new Date().getFullYear()} CSNoel Healthcare Staffing. Built for people who care.</div>
      </footer>
      <CSNoelChatWidget />
    </div>
  );
}
