import { PublicShell } from "@/components/PublicShell";
import { ArrowUpRight, Compass, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";

const PORTRAIT_IMAGE = "/manus-storage/csnoel-clinician-stethoscope_d2619591.jpg";

const values = [
  { icon: Compass, title: "Clarity over noise", body: "We make the next action visible, whether you are choosing a role or working through a staffing need." },
  { icon: HeartHandshake, title: "Human at every handoff", body: "Healthcare work is personal. The staffing experience should make space for questions, context, and real conversation." },
  { icon: ShieldCheck, title: "Care with the details", body: "From private resume handling to clear role information, we build the process around the trust it needs to earn." },
];

export default function About() {
  return (
    <PublicShell>
      <section className="bg-[#f5faff] py-14 sm:py-24">
        <div className="container grid gap-12 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-[#16a6a0] uppercase"><Sparkles className="size-4" /> About CSNoel</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-extrabold tracking-[-0.07em] text-[#102848] sm:text-6xl">Staffing is about people. The process should show it.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">CSNoel was shaped around a simple idea: people who provide care—and the teams that depend on them—deserve a more direct, more thoughtful way to connect.</p>
            <Link href="/jobs" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#0b1f3a] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(11,31,58,0.16)] hover:bg-[#123766]">Explore opportunities <ArrowUpRight className="size-4" /></Link>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-[2rem] bg-[#0b1f3a] p-3 shadow-[0_24px_50px_rgba(15,46,86,0.18)]"><img src={PORTRAIT_IMAGE} alt="Clinician with a stethoscope" className="aspect-[0.88] w-full rounded-[1.45rem] object-cover object-[58%_center]" /></div>
            <div className="absolute -right-3 bottom-7 rounded-2xl bg-[#3bd6c6] px-5 py-4 text-[#0b1f3a] shadow-xl sm:-right-8"><p className="text-xs font-extrabold tracking-[0.14em] uppercase">Our focus</p><p className="mt-1 text-sm font-bold">A better way to move care forward.</p></div>
          </div>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-24">
        <div className="container">
          <div className="max-w-2xl"><p className="text-xs font-extrabold tracking-[0.16em] text-[#1377d5] uppercase">What guides the experience</p><h2 className="mt-3 text-4xl font-extrabold tracking-[-0.055em] text-[#102848] sm:text-5xl">Designed for confidence at every next step.</h2></div>
          <div className="mt-11 grid gap-5 md:grid-cols-3">
            {values.map((value) => { const Icon = value.icon; return <article key={value.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-[0_12px_30px_rgba(15,46,86,0.05)]"><div className="grid size-11 place-items-center rounded-2xl bg-sky-50 text-[#1377d5]"><Icon className="size-5" /></div><h3 className="mt-7 text-2xl font-extrabold tracking-[-0.045em] text-[#102848]">{value.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{value.body}</p></article>; })}
          </div>
        </div>
      </section>
      <section className="bg-[#0b1f3a] py-16 text-center text-white sm:py-20"><div className="container"><p className="text-xs font-extrabold tracking-[0.16em] text-[#3bd6c6] uppercase">Let’s make the next connection</p><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl">Whether you need a role or a team, CSNoel starts with a better conversation.</h2><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/jobs" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3bd6c6] px-6 py-3.5 text-sm font-bold text-[#0b1f3a] hover:bg-white">Find jobs <ArrowUpRight className="size-4" /></Link><Link href="/facilities" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white hover:border-[#3bd6c6] hover:text-[#3bd6c6]">For facilities <ArrowUpRight className="size-4" /></Link></div></div></section>
    </PublicShell>
  );
}
