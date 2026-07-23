export const JOB_TYPES = ["Travel", "LTC", "Rapid Response", "Per Diem"] as const;

export type JobType = (typeof JOB_TYPES)[number];

export type StaffingJob = {
  id: string;
  title: string;
  location: string;
  type: JobType;
  specialty: string;
  description: string;
  salary_range?: string | null;
  requirements?: string[] | null;
  benefits?: string[] | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export function formatJobType(type: JobType) {
  return type === "LTC" ? "LTC" : type;
}

export function getJobTypeTone(type: JobType) {
  switch (type) {
    case "Rapid Response":
      return "bg-amber-100 text-amber-900 border-amber-200";
    case "Per Diem":
      return "bg-violet-100 text-violet-900 border-violet-200";
    case "LTC":
      return "bg-teal-100 text-teal-900 border-teal-200";
    default:
      return "bg-sky-100 text-sky-900 border-sky-200";
  }
}
