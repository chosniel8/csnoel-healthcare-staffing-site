import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JOB_TYPES, type JobType, type StaffingJob } from "@/lib/csnoel";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  Loader2,
  MessageSquareText,
  Plus,
  ShieldAlert,
  SquarePen,
  UsersRound,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

type AdminTab = "jobs" | "applications" | "leads" | "chats" | "alerts";
type EditableJob = StaffingJob & { salary_range?: string | null; requirements?: string[] | null; benefits?: string[] | null };

const tabs: Array<{ id: AdminTab; label: string; icon: typeof BriefcaseBusiness }> = [
  { id: "jobs", label: "Jobs", icon: BriefcaseBusiness },
  { id: "applications", label: "Applications", icon: ClipboardList },
  { id: "leads", label: "Leads", icon: UsersRound },
  { id: "chats", label: "Chat review", icon: MessageSquareText },
  { id: "alerts", label: "Alerts", icon: Bell },
];

function splitLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function StatusPill({ active }: { active: boolean }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600")}>{active ? "Active" : "Inactive"}</span>;
}

function JobEditor({ job, open, onOpenChange }: { job: EditableJob | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const utils = trpc.useUtils();
  const createJob = trpc.admin.createJob.useMutation({ onSuccess: () => utils.admin.jobs.invalidate() });
  const updateJob = trpc.admin.updateJob.useMutation({ onSuccess: () => utils.admin.jobs.invalidate() });
  const [form, setForm] = useState(() => ({
    title: job?.title ?? "",
    location: job?.location ?? "",
    type: job?.type ?? "Travel" as JobType,
    specialty: job?.specialty ?? "",
    description: job?.description ?? "",
    salaryRange: job?.salary_range ?? "",
    requirements: (job?.requirements ?? []).join("\n"),
    benefits: (job?.benefits ?? []).join("\n"),
    isActive: job?.is_active ?? true,
  }));

  const pending = createJob.isPending || updateJob.isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) onOpenChange(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...form,
      requirements: splitLines(form.requirements),
      benefits: splitLines(form.benefits),
    };
    try {
      if (job) await updateJob.mutateAsync({ id: job.id, job: payload });
      else await createJob.mutateAsync(payload);
      toast.success(job ? "Job posting updated" : "Job posting created");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The job posting could not be saved.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100vh-1.5rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="pr-7 text-left">
          <DialogTitle className="text-2xl tracking-tight text-[#102848]">{job ? "Edit job posting" : "Create job posting"}</DialogTitle>
          <DialogDescription>Publish the specific role information candidates will see on the CSNoel opportunity board.</DialogDescription>
        </DialogHeader>
        <form className="mt-2 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[#102848]">Job title<Input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Registered Nurse" /></label>
            <label className="grid gap-2 text-sm font-semibold text-[#102848]">Location<Input required value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} placeholder="Austin, TX" /></label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[#102848]">Specialty<Input required value={form.specialty} onChange={(event) => setForm((current) => ({ ...current, specialty: event.target.value }))} placeholder="Critical Care" /></label>
            <label className="grid gap-2 text-sm font-semibold text-[#102848]">Job type<select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as JobType }))} className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">{JOB_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-[#102848]">Salary range <span className="font-normal text-slate-500">(optional)</span><Input value={form.salaryRange ?? ""} onChange={(event) => setForm((current) => ({ ...current, salaryRange: event.target.value }))} placeholder="$— / week, hour, or annual range" /></label>
          <label className="grid gap-2 text-sm font-semibold text-[#102848]">Role description<Textarea required minLength={20} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="min-h-36" placeholder="Describe the work, setting, schedule, and why this role matters." /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[#102848]">Requirements <span className="font-normal text-slate-500">(one per line)</span><Textarea value={form.requirements} onChange={(event) => setForm((current) => ({ ...current, requirements: event.target.value }))} className="min-h-28" placeholder="Active RN license\nBLS certification" /></label>
            <label className="grid gap-2 text-sm font-semibold text-[#102848]">Benefits <span className="font-normal text-slate-500">(one per line)</span><Textarea value={form.benefits} onChange={(event) => setForm((current) => ({ ...current, benefits: event.target.value }))} className="min-h-28" placeholder="Weekly pay\nHousing support" /></label>
          </div>
          <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-[#102848]"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} className="size-4 rounded border-slate-300 text-[#1377d5]" /> Make this role visible on the public opportunity board</label>
          <Button disabled={pending} type="submit" className="h-11 rounded-full bg-[#0b1f3a] font-bold text-white hover:bg-[#123766]">{pending ? <><Loader2 className="mr-2 size-4 animate-spin" />Saving…</> : job ? "Save changes" : "Create job posting"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminWorkspace() {
  const [tab, setTab] = useState<AdminTab>("jobs");
  const [editor, setEditor] = useState<{ open: boolean; job: EditableJob | null }>({ open: false, job: null });
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const jobsQuery = trpc.admin.jobs.useQuery();
  const applicationsQuery = trpc.admin.applications.useQuery();
  const leadsQuery = trpc.admin.leads.useQuery();
  const notificationsQuery = trpc.admin.notifications.useQuery();
  const conversationsQuery = trpc.admin.chatConversations.useQuery();
  const messagesQuery = trpc.admin.chatMessages.useQuery(selectedConversation ?? "", { enabled: Boolean(selectedConversation) });
  const jobStatusMutation = trpc.admin.setJobActive.useMutation({ onSuccess: () => utils.admin.jobs.invalidate() });
  const resumeDownloadMutation = trpc.admin.resumeDownload.useMutation();
  const markReadMutation = trpc.admin.markNotificationRead.useMutation({ onSuccess: () => utils.admin.notifications.invalidate() });

  const jobs = (jobsQuery.data ?? []) as EditableJob[];
  const applications = applicationsQuery.data ?? [];
  const leads = leadsQuery.data ?? [];
  const notifications = notificationsQuery.data ?? [];
  const conversations = conversationsQuery.data ?? [];
  const unreadAlerts = notifications.filter((item) => !item.is_read).length;
  const activeJobs = jobs.filter((job) => job.is_active).length;

  const openResume = async (applicationId: string) => {
    try {
      const response = await resumeDownloadMutation.mutateAsync(applicationId);
      window.open(response.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The private resume link could not be created.");
    }
  };

  const view = (() => {
    if (tab === "jobs") {
      return (
        <section>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold tracking-[0.15em] text-[#16a6a0] uppercase">Opportunity management</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">Jobs</h1></div><Button onClick={() => setEditor({ open: true, job: null })} className="h-11 rounded-full bg-[#0b1f3a] font-bold text-white hover:bg-[#123766]"><Plus className="mr-2 size-4" />New job</Button></div>
          <div className="mt-7 overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-sm">
            {jobsQuery.isLoading ? <div className="p-8 text-sm text-slate-500">Loading job postings…</div> : jobs.length ? <div className="divide-y divide-slate-100">{jobs.map((job) => <div key={job.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-[#102848]">{job.title}</h2><StatusPill active={Boolean(job.is_active)} /></div><p className="mt-1 text-sm text-slate-600">{job.specialty} · {job.location} · {job.type}</p><p className="mt-2 text-xs text-slate-400">Updated {formatDate(job.updated_at)}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => setEditor({ open: true, job })}><SquarePen className="mr-1.5 size-3.5" />Edit</Button><Button variant="outline" size="sm" disabled={jobStatusMutation.isPending} onClick={() => jobStatusMutation.mutate({ id: job.id, isActive: !job.is_active })}>{job.is_active ? "Deactivate" : "Reactivate"}</Button></div></div>)}</div> : <div className="p-8 text-sm text-slate-600">No job postings have been created yet.</div>}
          </div>
        </section>
      );
    }
    if (tab === "applications") {
      return (
        <section><div><p className="text-xs font-extrabold tracking-[0.15em] text-[#16a6a0] uppercase">Candidate review</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">Applications</h1></div><div className="mt-7 overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-sm">{applicationsQuery.isLoading ? <div className="p-8 text-sm text-slate-500">Loading applications…</div> : applications.length ? <div className="divide-y divide-slate-100">{applications.map((application) => <div key={application.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-bold text-[#102848]">{application.applicant_name}</h2><p className="mt-1 text-sm text-slate-600">{application.applicant_email}{application.applicant_phone ? ` · ${application.applicant_phone}` : ""}</p><p className="mt-2 text-xs text-slate-400">Submitted {formatDate(application.created_at)} · {application.status}</p></div><Button variant="outline" size="sm" disabled={resumeDownloadMutation.isPending} onClick={() => openResume(application.id)}><FileText className="mr-1.5 size-3.5" />Private resume <ExternalLink className="ml-1.5 size-3.5" /></Button></div>)}</div> : <div className="p-8 text-sm text-slate-600">No applications have been submitted yet.</div>}</div></section>
      );
    }
    if (tab === "leads") {
      return (
        <section><div><p className="text-xs font-extrabold tracking-[0.15em] text-[#16a6a0] uppercase">Relationship queue</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">Leads</h1></div><div className="mt-7 grid gap-4">{leadsQuery.isLoading ? <div className="rounded-[1.35rem] border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading leads…</div> : leads.length ? leads.map((lead) => <article key={lead.id} className="rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><div className="flex items-center gap-2"><h2 className="font-bold text-[#102848]">{lead.name}</h2><span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-[#1377d5]">{lead.type}</span></div><p className="mt-1 text-sm text-slate-600">{lead.email}{lead.phone ? ` · ${lead.phone}` : ""}</p></div><p className="text-xs font-bold text-slate-400">{lead.source} · {formatDate(lead.created_at)}</p></div>{lead.message ? <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">{lead.message}</p> : null}</article>) : <div className="rounded-[1.35rem] border border-slate-200 bg-white p-8 text-sm text-slate-600">No leads have been captured yet.</div>}</div></section>
      );
    }
    if (tab === "chats") {
      return (
        <section><div><p className="text-xs font-extrabold tracking-[0.15em] text-[#16a6a0] uppercase">Privacy-preserving review</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">Chat conversations</h1><p className="mt-2 text-sm text-slate-600">Conversation content is retained with direct identifiers redacted.</p></div><div className="mt-7 grid overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[280px_1fr]"><aside className="border-b border-slate-100 lg:border-r lg:border-b-0">{conversationsQuery.isLoading ? <p className="p-5 text-sm text-slate-500">Loading chats…</p> : conversations.length ? <div className="max-h-[480px] overflow-y-auto">{conversations.map((conversation) => <button key={conversation.id} onClick={() => setSelectedConversation(conversation.id)} className={cn("w-full border-b border-slate-100 px-5 py-4 text-left transition-colors", selectedConversation === conversation.id ? "bg-sky-50" : "hover:bg-slate-50")}><p className="text-sm font-bold text-[#102848]">Conversation</p><p className="mt-1 text-xs text-slate-500">{formatDate(conversation.updated_at)}</p></button>)}</div> : <p className="p-5 text-sm text-slate-600">No chats yet.</p>}</aside><div className="min-h-[330px] p-5">{selectedConversation ? messagesQuery.isLoading ? <p className="text-sm text-slate-500">Loading conversation…</p> : <div className="space-y-3">{(messagesQuery.data ?? []).map((message) => <div key={message.id} className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6", message.role === "assistant" ? "mr-auto bg-slate-100 text-slate-700" : "ml-auto bg-[#0b1f3a] text-white")}><p className="mb-1 text-[10px] font-extrabold tracking-[0.12em] uppercase opacity-60">{message.role}</p>{message.content}</div>)}</div> : <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">Select a conversation to review its redacted message history.</div>}</div></div></section>
      );
    }
    return (
      <section><div><p className="text-xs font-extrabold tracking-[0.15em] text-[#16a6a0] uppercase">Owner delivery</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">Alerts</h1></div><div className="mt-7 grid gap-3">{notificationsQuery.isLoading ? <div className="rounded-[1.35rem] border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading alerts…</div> : notifications.length ? notifications.map((alert) => <article key={alert.id} className={cn("flex flex-col justify-between gap-4 rounded-[1.35rem] border p-5 shadow-sm sm:flex-row sm:items-start", alert.is_read ? "border-slate-200 bg-white" : "border-sky-200 bg-sky-50/60")}><div><div className="flex items-center gap-2"><Bell className="size-4 text-[#1377d5]" /><h2 className="font-bold text-[#102848]">{alert.title}</h2>{!alert.is_read ? <span className="rounded-full bg-[#1377d5] px-2 py-0.5 text-[10px] font-bold text-white">NEW</span> : null}</div><p className="mt-2 text-sm leading-6 text-slate-600">{alert.body}</p><p className="mt-2 text-xs text-slate-400">{formatDate(alert.created_at)}</p></div>{!alert.is_read ? <Button size="sm" variant="outline" disabled={markReadMutation.isPending} onClick={() => markReadMutation.mutate(alert.id)}>Mark read</Button> : null}</article>) : <div className="rounded-[1.35rem] border border-slate-200 bg-white p-8 text-sm text-slate-600">No alerts have been generated yet.</div>}</div></section>
    );
  })();

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-[#f6f9fd] p-3 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center"><div><p className="text-xs font-extrabold tracking-[0.16em] text-[#16a6a0] uppercase">Secure operations</p><p className="mt-1 text-sm text-slate-600">CSNoel Healthcare Staffing command center</p></div><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#1377d5] hover:text-[#0b1f3a]">View public site <ChevronRight className="size-4" /></Link></header>
        <div className="grid gap-4 md:grid-cols-3"><div className="rounded-[1.35rem] bg-[#0b1f3a] p-5 text-white"><BriefcaseBusiness className="size-5 text-[#3bd6c6]" /><p className="mt-7 text-3xl font-extrabold tracking-[-0.05em]">{activeJobs}</p><p className="mt-1 text-sm font-bold text-slate-300">active job postings</p></div><div className="rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm"><ClipboardList className="size-5 text-[#1377d5]" /><p className="mt-7 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">{applications.length}</p><p className="mt-1 text-sm font-bold text-slate-500">candidate applications</p></div><div className="rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm"><Bell className="size-5 text-[#16a6a0]" /><p className="mt-7 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">{unreadAlerts}</p><p className="mt-1 text-sm font-bold text-slate-500">unread owner alerts</p></div></div>
        <div className="mt-7 overflow-x-auto"><div className="inline-flex min-w-max gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">{tabs.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setTab(item.id)} className={cn("inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors", tab === item.id ? "bg-[#0b1f3a] text-white" : "text-slate-600 hover:bg-slate-50 hover:text-[#102848]")}><Icon className="size-4" />{item.label}{item.id === "alerts" && unreadAlerts ? <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", tab === item.id ? "bg-[#3bd6c6] text-[#0b1f3a]" : "bg-sky-100 text-[#1377d5]")}>{unreadAlerts}</span> : null}</button>})}</div></div>
        <div className="mt-7">{view}</div>
      </div>
      <JobEditor job={editor.job} open={editor.open} onOpenChange={(open) => setEditor((current) => ({ ...current, open }))} />
    </div>
  );
}

function AccessDenied() {
  return <div className="grid min-h-screen place-items-center bg-[#f5faff] p-6"><div className="max-w-lg rounded-[2rem] border border-slate-200 bg-white p-9 text-center shadow-[0_20px_50px_rgba(15,46,86,0.1)]"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-600"><ShieldAlert className="size-7" /></div><h1 className="mt-6 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">Admin access required</h1><p className="mt-3 leading-7 text-slate-600">This CSNoel workspace is protected by both sign-in and role-based access controls. Contact the platform owner if you believe you should have access.</p><Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-white hover:bg-[#123766]">Return to CSNoel <ChevronRight className="size-4" /></Link></div></div>;
}

export default function Admin() {
  const { loading, user } = useAuth();
  if (loading || !user) return <DashboardLayout><div /></DashboardLayout>;
  if (user.role !== "admin") return <AccessDenied />;
  return <DashboardLayout><AdminWorkspace /></DashboardLayout>;
}
