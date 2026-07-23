import { JobApplicationDialog } from "@/components/JobApplicationDialog";
import { PublicShell } from "@/components/PublicShell";
import { getJobTypeTone, type StaffingJob } from "@/lib/csnoel";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Building2, CheckCircle2, Gift, MapPin, ShieldCheck, Stethoscope } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function JobDetail() {
  const [, params] = useRoute("/jobs/:id");
  const jobId = params?.id ?? "";
  const jobQuery = trpc.staffing.job.useQuery(jobId, { enabled: Boolean(jobId) });
  const job = jobQuery.data as StaffingJob | undefined;

  if (jobQuery.isLoading) {
    return (
      <PublicShell>
        <div className="container py-20"><div className="h-[480px] animate-pulse rounded-[2rem] bg-slate-100" /></div>
      </PublicShell>
    );
  }

  if (!job) {
    return (
      <PublicShell>
        <section className="container py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-[#102848]">This opportunity is no longer available.</h1>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-600">It may have been filled or taken offline. Browse the opportunity board to see what is currently active.</p>
          <Link href="/jobs" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-white hover:bg-[#123766]"><ArrowLeft className="size-4" /> Back to jobs</Link>
        </section>
      </PublicShell>
    );
  }

  const requirements = job.requirements ?? [];
  const benefits = job.benefits ?? [];

  return (
    <PublicShell>
      <section className="bg-[#f5faff] py-10 sm:py-16">
        <div className="container">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-[#1377d5] hover:text-[#0b1f3a]"><ArrowLeft className="size-4" /> All openings</Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${getJobTypeTone(job.type)}`}>{job.type}</span>
              <h1 className="mt-5 max-w-4xl text-5xl font-extrabold tracking-[-0.065em] text-[#102848] sm:text-6xl">{job.title}</h1>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2"><Stethoscope className="size-4 text-[#16a6a0]" />{job.specialty}</span>
                <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-[#16a6a0]" />{job.location}</span>
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-[#0b1f3a] p-6 text-white shadow-[0_16px_34px_rgba(11,31,58,0.16)]">
              <p className="text-xs font-extrabold tracking-[0.15em] text-[#3bd6c6] uppercase">Compensation</p>
              <p className="mt-2 text-2xl font-extrabold tracking-tight">{job.salary_range || "Discuss with CSNoel"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">We’ll help clarify the details of this opening before you apply.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-18">
        <div className="container grid gap-10 lg:grid-cols-[1fr_330px]">
          <div className="min-w-0">
            <div>
              <p className="text-xs font-extrabold tracking-[0.16em] text-[#16a6a0] uppercase">The role</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#102848]">What you’ll step into</h2>
              <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-650">{job.description}</p>
            </div>
            {requirements.length ? (
              <div className="mt-12 border-t border-slate-100 pt-10">
                <div className="flex items-center gap-3"><CheckCircle2 className="size-5 text-[#16a6a0]" /><h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[#102848]">Requirements</h2></div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">{requirements.map((item) => <li key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul>
              </div>
            ) : null}
            {benefits.length ? (
              <div className="mt-12 border-t border-slate-100 pt-10">
                <div className="flex items-center gap-3"><Gift className="size-5 text-[#1377d5]" /><h2 className="text-2xl font-extrabold tracking-[-0.04em] text-[#102848]">Benefits & support</h2></div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">{benefits.map((item) => <li key={item} className="rounded-xl bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-700">{item}</li>)}</ul>
              </div>
            ) : null}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,46,86,0.08)]">
              <Building2 className="size-6 text-[#1377d5]" />
              <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.045em] text-[#102848]">Ready to explore it?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Your secure application is a simple starting point. A CSNoel team member will review it next.</p>
              <div className="mt-6"><JobApplicationDialog job={job} /></div>
              <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#16a6a0]" /> Resume files are stored privately and only available to authorized CSNoel reviewers.</p>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}
