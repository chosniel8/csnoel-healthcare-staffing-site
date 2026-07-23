import { JobCard } from "@/components/JobCard";
import { PublicShell } from "@/components/PublicShell";
import { JOB_TYPES, type JobType, type StaffingJob } from "@/lib/csnoel";
import { trpc } from "@/lib/trpc";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function Jobs() {
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<JobType | "">("");
  const filters = useMemo(
    () => ({
      specialty: specialty.trim() || undefined,
      location: location.trim() || undefined,
      type: type || undefined,
    }),
    [location, specialty, type],
  );
  const jobsQuery = trpc.staffing.jobs.useQuery(filters);
  const jobs = (jobsQuery.data ?? []) as StaffingJob[];
  const hasFilters = Boolean(specialty || location || type);

  const clearFilters = () => {
    setSpecialty("");
    setLocation("");
    setType("");
  };

  return (
    <PublicShell>
      <section className="bg-[#0b1f3a] py-16 text-white sm:py-24">
        <div className="container max-w-5xl">
          <p className="text-xs font-extrabold tracking-[0.16em] text-[#3bd6c6] uppercase">CSNoel opportunity board</p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-[-0.065em] sm:text-6xl">Find work that fits the way you care.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Search active CSNoel openings by specialty, location, or the way you want to work.</p>
        </div>
      </section>

      <section className="bg-[#f5faff] py-10 sm:py-14">
        <div className="container">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,46,86,0.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-sm font-extrabold text-[#102848]"><SlidersHorizontal className="size-4 text-[#1377d5]" /> Refine your search</p>
              {hasFilters ? <button onClick={clearFilters} className="inline-flex items-center gap-1 text-sm font-bold text-[#1377d5] hover:text-[#0b1f3a]"><X className="size-4" /> Clear filters</button> : null}
            </div>
            <div className="grid gap-3 lg:grid-cols-[1.1fr_1.1fr_0.8fr]">
              <label className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                <input aria-label="Filter by specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)} placeholder="Specialty, e.g. ICU" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
              </label>
              <label className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                <input aria-label="Filter by location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location, e.g. Dallas" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
              </label>
              <select aria-label="Filter by job type" value={type} onChange={(event) => setType(event.target.value as JobType | "")} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#102848] outline-none transition-colors focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
                <option value="">All job types</option>
                {JOB_TYPES.map((jobType) => <option key={jobType} value={jobType}>{jobType}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-600">{jobsQuery.isLoading ? "Searching openings…" : `${jobs.length} ${jobs.length === 1 ? "opening" : "openings"} found`}</p>
            <Filter className="size-4 text-[#16a6a0]" />
          </div>
          {jobsQuery.isLoading ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="h-72 animate-pulse rounded-[1.5rem] bg-white" />)}</div>
          ) : jobs.length ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{jobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
          ) : (
            <div className="mt-5 rounded-[1.75rem] border border-dashed border-sky-200 bg-white px-6 py-14 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-[#102848]">No active roles match that search just yet.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">Try a broader search, remove a filter, or ask the CSNoel assistant about the work you’re hoping to find.</p>
              {hasFilters ? <button onClick={clearFilters} className="mt-6 rounded-full bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-white hover:bg-[#123766]">Clear all filters</button> : null}
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
