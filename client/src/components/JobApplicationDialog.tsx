import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type StaffingJob } from "@/lib/csnoel";
import { trpc } from "@/lib/trpc";
import { FileText, Loader2, Paperclip, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

type JobApplicationDialogProps = {
  job: StaffingJob;
};

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

type ResumeMimeType = (typeof ACCEPTED_TYPES)[number];

function isAcceptedResumeMimeType(value: string): value is ResumeMimeType {
  return (ACCEPTED_TYPES as readonly string[]).includes(value);
}

export function JobApplicationDialog({ job }: JobApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState<string | null>(null);

  const createUpload = trpc.staffing.createResumeUpload.useMutation();
  const submitApplication = trpc.staffing.submitApplication.useMutation();
  const pending = createUpload.isPending || submitApplication.isPending;

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "" });
    setFile(null);
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("Please attach your resume as a PDF, DOC, or DOCX file.");
      return;
    }
    if (!isAcceptedResumeMimeType(file.type)) {
      setError("We can accept PDF, DOC, and DOCX resumes only.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Please choose a resume smaller than 10 MB.");
      return;
    }

    try {
      const upload = await createUpload.mutateAsync({
        jobId: job.id,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      const uploadResponse = await fetch(upload.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Your resume could not be uploaded. Please try again.");
      }

      await submitApplication.mutateAsync({
        jobId: job.id,
        applicantName: form.name,
        applicantEmail: form.email,
        applicantPhone: form.phone,
        uploadToken: upload.uploadToken,
      });

      toast.success("Application received", {
        description: "The CSNoel team has been notified and will review your application.",
      });
      handleOpenChange(false);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not submit your application. Please try again.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-full bg-[#1377d5] px-6 text-base font-bold text-white shadow-[0_12px_24px_rgba(19,119,213,0.24)] hover:bg-[#0f65b7]">
          Apply now <span aria-hidden="true">→</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-1.5rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader className="pr-7 text-left">
          <div className="mb-1 flex size-10 items-center justify-center rounded-2xl bg-sky-100 text-[#1377d5]">
            <FileText className="size-5" />
          </div>
          <DialogTitle className="text-2xl tracking-tight text-[#102848]">Apply for {job.title}</DialogTitle>
          <DialogDescription className="leading-6">
            Share your contact information and resume. Your resume is stored privately and reviewed by the CSNoel team.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-[#102848]">
            Full name
            <Input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Your name" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#102848]">
            Email address
            <Input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="you@example.com" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#102848]">
            Phone number <span className="font-normal text-slate-500">(optional)</span>
            <Input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="(555) 555-5555" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#102848]">
            Resume
            <span className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-sky-300 bg-sky-50/60 px-4 text-center transition-colors hover:bg-sky-50">
              <Paperclip className="mb-2 size-5 text-[#1377d5]" />
              <span className="text-sm font-semibold text-[#102848]">{file ? file.name : "Choose a PDF, DOC, or DOCX"}</span>
              <span className="mt-1 text-xs font-normal text-slate-500">Maximum file size: 10 MB</span>
              <input className="sr-only" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </span>
          </label>
          {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{error}</p> : null}
          <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#16a6a0]" />
            CSNoel uses a secure, private storage workflow for resume files.
          </div>
          <Button disabled={pending} type="submit" className="h-12 w-full rounded-full bg-[#0b1f3a] text-base font-bold text-white hover:bg-[#123766]">
            {pending ? <><Loader2 className="mr-2 size-4 animate-spin" />Submitting securely…</> : "Submit application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
