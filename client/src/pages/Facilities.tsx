import { PublicShell } from "@/components/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, Building2, CheckCircle2, Loader2, ShieldCheck, UsersRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

const supportPoints = [
  "A direct intake path for current and future staffing needs.",
  "A conversation grounded in the role, timing, and care context you share.",
  "Clear handoff to the CSNoel team—without a generic contact queue.",
];

export default function Facilities() {
  const [form, setForm] = useState({ contactName: "", email: "", phone: "", organization: "", message: "" });
  const [complete, setComplete] = useState(false);
  const submitInquiry = trpc.staffing.submitFacilityInquiry.useMutation({
    onSuccess: () => {
      setComplete(true);
      setForm({ contactName: "", email: "", phone: "", organization: "", message: "" });
      toast.success("Your message is on its way", { description: "The CSNoel team has been notified." });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitInquiry.mutate(form);
  };

  return (
    <PublicShell>
      <section className="bg-[#0b1f3a] py-16 text-white sm:py-24">
        <div className="container grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
            <p className="text-xs font-extrabold tracking-[0.16em] text-[#3bd6c6] uppercase">For healthcare facilities</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-extrabold tracking-[-0.065em] sm:text-6xl">When coverage matters, your staffing partner should feel close by.</h1>
          </div>
          <p className="max-w-lg text-lg leading-8 text-slate-300">Tell CSNoel where your team needs support. We’ll begin with the needs you share—not a one-size-fits-all pitch.</p>
        </div>
      </section>

      <section className="bg-[#f5faff] py-14 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] bg-[#eafaf7] p-7 sm:p-9">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-[#16a6a0] shadow-sm"><UsersRound className="size-6" /></div>
            <h2 className="mt-7 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">A responsive starting point for your care team.</h2>
            <div className="mt-8 grid gap-5">
              {supportPoints.map((point) => <div key={point} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#16a6a0]" />{point}</div>)}
            </div>
            <div className="mt-10 rounded-2xl bg-[#0b1f3a] p-5 text-white"><Building2 className="size-5 text-[#3bd6c6]" /><p className="mt-3 text-sm font-bold leading-6">Need to discuss an opening right now? Use the Ask CSNoel button in the lower-right corner to begin.</p></div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_18px_44px_rgba(15,46,86,0.08)] sm:p-9">
            {complete ? (
              <div className="flex min-h-[470px] flex-col items-center justify-center text-center">
                <div className="grid size-14 place-items-center rounded-2xl bg-[#eafaf7] text-[#16a6a0]"><CheckCircle2 className="size-7" /></div>
                <h2 className="mt-6 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">Thank you for reaching out.</h2>
                <p className="mt-3 max-w-md leading-7 text-slate-600">Your staffing inquiry is securely in the CSNoel team’s queue. We’ll use the information you provided to prepare the next conversation.</p>
                <button onClick={() => setComplete(false)} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#1377d5] hover:text-[#0b1f3a]">Send another inquiry <ArrowUpRight className="size-4" /></button>
              </div>
            ) : (
              <>
                <p className="text-xs font-extrabold tracking-[0.16em] text-[#1377d5] uppercase">Tell us what you need</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[#102848]">Start a staffing conversation</h2>
                <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-[#102848]">Your name<Input required value={form.contactName} onChange={(event) => setForm((current) => ({ ...current, contactName: event.target.value }))} placeholder="Name" /></label>
                    <label className="grid gap-2 text-sm font-semibold text-[#102848]">Organization<Input required value={form.organization} onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))} placeholder="Facility or organization" /></label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-[#102848]">Email<Input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="you@organization.com" /></label>
                    <label className="grid gap-2 text-sm font-semibold text-[#102848]">Phone <span className="font-normal text-slate-500">(optional)</span><Input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="(555) 555-5555" /></label>
                  </div>
                  <label className="grid gap-2 text-sm font-semibold text-[#102848]">What kind of coverage are you planning for?<Textarea required minLength={10} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className="min-h-35 resize-y" placeholder="Share the roles, timing, location, and anything else that will help us understand the need." /></label>
                  {submitInquiry.error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitInquiry.error.message}</p> : null}
                  <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex max-w-sm items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#16a6a0]" /> Your inquiry is sent through CSNoel’s secure server-side workflow.</p>
                    <Button disabled={submitInquiry.isPending} type="submit" className="h-12 rounded-full bg-[#1377d5] px-6 font-bold text-white hover:bg-[#0f65b7]">{submitInquiry.isPending ? <><Loader2 className="mr-2 size-4 animate-spin" />Sending…</> : "Send inquiry"}</Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
