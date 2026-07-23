import { JobCard } from "@/components/JobCard";
import { PublicShell } from "@/components/PublicShell";
import { type StaffingJob } from "@/lib/csnoel";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "wouter";

const HERO_IMAGE = "/manus-storage/csnoel-clinicians-corridor_31a9a5ed.jpg";
const PORTRAIT_IMAGE = "/manus-storage/csnoel-clinician-stethoscope_10219176.jpg";

const STATS = [
  { value: "4", label: "ways to work", detail: "Travel, LTC, Rapid Response, Per Diem" },
  { value: "2", label: "sides of care", detail: "Clinicians and facilities, equally supported" },
  { value: "1", label: "clear next step", detail: "A conversation tailored to your goals" },
];

const audienceCards = [
  {
    icon: Stethoscope,
    eyebrow: "For clinicians",
    title: "Find a role that keeps up with you.",
    body: "Explore opportunities with a process that stays focused on your next meaningful move—not a maze of forms.",
    href: "/jobs",
    cta: "Find open roles",
    tone: "bg-[#e9f6ff]",
  },
  {
    icon: Building2,
    eyebrow: "For facilities",
    title: "Staffing support that meets the moment.",
    body: "Tell us where your team needs coverage, and start a direct conversation with CSNoel about the path forward.",
    href: "/facilities",
    cta: "Partner with CSNoel",
    tone: "bg-[#eafaf7]",
  },
];

export default function Home() {
  const initialFilters = useMemo(() => ({}), []);
  const jobsQuery = trpc.staffing.jobs.useQuery(initialFilters);
  const featuredJobs = ((jobsQuery.data ?? []) as StaffingJob[]).slice(0, 3);

  return (
    <PublicShell>
      <section className="relative overflow-hidden bg-[#f5faff] pb-14 pt-8 sm:pb-20 sm:pt-12">
        <div className="pointer-events-none absolute -top-44 right-[-14rem] size-[36rem] rounded-full bg-sky-200/35 blur-3xl" />
        <div className="container relative grid items-center gap-11 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10"
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.13em] text-[#1377d5] uppercase shadow-sm">
              <Sparkles className="size-3.5" /> Healthcare staffing, re-centered
            </p>
            <h1 className="max-w-xl text-[clamp(3rem,7vw,5.7rem)] font-extrabold leading-[0.93] tracking-[-0.075em] text-[#0b1f3a]">
              Care moves fast.<br /><span className="text-[#1377d5]">So should</span> your next move.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              CSNoel connects healthcare professionals and facilities through a clearer, more human staffing experience.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" className="inline-flex h-13 items-center justify-center rounded-full bg-[#0b1f3a] px-6 text-base font-bold text-white shadow-[0_16px_30px_rgba(11,31,58,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#123766] active:scale-[0.97]">
                Find your next role <ArrowUpRight className="ml-2 size-5" />
              </Link>
              <Link href="/facilities" className="inline-flex h-13 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-base font-bold text-[#102848] transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 active:scale-[0.97]">
                Need staffing support?
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-[#16a6a0]" /> Private resume workflow</span>
              <span className="inline-flex items-center gap-2"><HeartPulse className="size-4 text-[#16a6a0]" /> Human-first support</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="relative mx-auto w-full max-w-2xl lg:mx-0"
          >
            <div className="overflow-hidden rounded-[2rem] bg-[#0b1f3a] p-3 shadow-[0_35px_80px_rgba(15,46,86,0.24)] sm:p-4">
              <div className="relative aspect-[1.12/1] overflow-hidden rounded-[1.35rem]">
                <img src={HERO_IMAGE} alt="Healthcare clinicians walking together through a hospital corridor" className="size-full object-cover object-[50%_44%]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1f3a]/72 via-transparent to-white/20" />
                <div className="absolute right-4 bottom-4 left-4 rounded-2xl border border-white/25 bg-[#0b1f3a]/84 p-4 text-white backdrop-blur-sm sm:right-6 sm:bottom-6 sm:left-auto sm:w-64">
                  <p className="text-xs font-bold tracking-[0.14em] text-[#3bd6c6] uppercase">The CSNoel difference</p>
                  <p className="mt-2 text-lg font-bold leading-6">A direct path from interest to opportunity.</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-2 rounded-[1.4rem] bg-[#3bd6c6] px-5 py-4 text-[#0b1f3a] shadow-[0_14px_30px_rgba(59,214,198,0.25)] sm:-left-8">
              <p className="text-[0.65rem] font-extrabold tracking-[0.16em] uppercase">Start here</p>
              <p className="mt-1 text-sm font-bold">See what’s open now <span aria-hidden="true">↗</span></p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 -mt-2 pb-16 sm:pb-24">
        <div className="container">
          <div className="grid overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_46px_rgba(11,31,58,0.08)] md:grid-cols-3">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ delay: index * 0.08, duration: 0.42 }}
                className="border-b border-slate-100 p-7 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
              >
                <p className="text-5xl font-extrabold tracking-[-0.07em] text-[#1377d5]">{stat.value}</p>
                <p className="mt-2 text-base font-bold text-[#102848]">{stat.label}</p>
                <p className="mt-1 text-sm leading-5 text-slate-500">{stat.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold tracking-[0.16em] text-[#16a6a0] uppercase">Choose your direction</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.055em] text-[#102848] sm:text-5xl">The work is important. The way you get there should feel better.</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {audienceCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.eyebrow} className={`${card.tone} group rounded-[1.75rem] p-7 sm:p-9`}>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-[#1377d5] shadow-sm"><Icon className="size-6" /></div>
                  <p className="mt-7 text-xs font-extrabold tracking-[0.16em] text-[#1377d5] uppercase">{card.eyebrow}</p>
                  <h3 className="mt-3 max-w-lg text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">{card.title}</h3>
                  <p className="mt-4 max-w-xl leading-7 text-slate-600">{card.body}</p>
                  <Link href={card.href} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#0b1f3a] transition-transform duration-200 group-hover:translate-x-1">{card.cta} <ArrowUpRight className="size-4" /></Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1f3a] py-16 text-white sm:py-24">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative mx-auto w-full max-w-sm lg:mx-0">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3">
              <img src={PORTRAIT_IMAGE} alt="Clinician holding a stethoscope" className="aspect-[0.78] w-full rounded-[1.45rem] object-cover object-[50%_42%]" />
              <div className="absolute right-0 bottom-8 rounded-l-2xl bg-[#3bd6c6] px-5 py-4 text-[#0b1f3a] shadow-xl">
                <p className="text-xl font-extrabold">Your goals.</p>
                <p className="text-sm font-bold">Your next chapter.</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold tracking-[0.16em] text-[#3bd6c6] uppercase">A more considered match</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl">We keep the conversation focused on the work—and the people behind it.</h2>
            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {[
                ["01", "Explore", "Browse roles by specialty, location, and job type."],
                ["02", "Connect", "Ask questions before you invest more of your time."],
                ["03", "Move", "Apply securely when an opportunity fits."],
              ].map(([number, title, body]) => (
                <div key={number} className="border-t border-white/20 pt-4">
                  <p className="text-sm font-extrabold text-[#3bd6c6]">{number}</p>
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
                </div>
              ))}
            </div>
            <Link href="/about" className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-[#3bd6c6] hover:text-[#3bd6c6]">Why CSNoel <ArrowUpRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f5faff] py-16 sm:py-24">
        <div className="container">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold tracking-[0.16em] text-[#16a6a0] uppercase">Opportunity board</p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.055em] text-[#102848] sm:text-5xl">Fresh roles, clearly presented.</h2>
            </div>
            <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-[#1377d5] hover:text-[#0b1f3a]">View all openings <ArrowUpRight className="size-4" /></Link>
          </div>
          {jobsQuery.isLoading ? (
            <div className="mt-10 grid gap-5 md:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-72 animate-pulse rounded-[1.5rem] bg-white" />)}</div>
          ) : featuredJobs.length ? (
            <div className="mt-10 grid gap-5 md:grid-cols-3">{featuredJobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
          ) : (
            <div className="mt-10 rounded-[1.75rem] border border-dashed border-sky-200 bg-white px-7 py-12 text-center">
              <MapPin className="mx-auto size-7 text-[#16a6a0]" />
              <h3 className="mt-4 text-xl font-bold text-[#102848]">New opportunities are being prepared.</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Check back soon, explore the full job board, or start a chat to tell us what you’re looking for.</p>
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
