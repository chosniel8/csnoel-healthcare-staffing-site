import { getJobTypeTone, type StaffingJob } from "@/lib/csnoel";
import { ArrowUpRight, MapPin, Stethoscope } from "lucide-react";
import { Link } from "wouter";

type JobCardProps = {
  job: StaffingJob;
  compact?: boolean;
};

export function JobCard({ job, compact = false }: JobCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,46,86,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_20px_45px_rgba(15,46,86,0.12)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${getJobTypeTone(job.type)}`}>
          {job.type}
        </span>
        <ArrowUpRight className="size-5 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#1377d5]" />
      </div>
      <h3 className="text-xl leading-tight font-bold tracking-tight text-[#102848]">{job.title}</h3>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2"><Stethoscope className="size-4 text-[#16a6a0]" />{job.specialty}</p>
        <p className="flex items-center gap-2"><MapPin className="size-4 text-[#16a6a0]" />{job.location}</p>
      </div>
      {!compact && job.salary_range ? (
        <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-[#102848]">{job.salary_range}</p>
      ) : null}
      <div className="mt-auto pt-6">
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#1377d5] transition-colors hover:text-[#0b1f3a]"
        >
          View opportunity <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
