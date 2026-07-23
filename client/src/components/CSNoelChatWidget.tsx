import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { MessageCircleMore, Sparkles } from "lucide-react";
import { useState } from "react";

const SUGGESTED_PROMPTS = [
  "Show me nursing jobs near me",
  "What is a Rapid Response role?",
  "I am a facility looking for staff",
];

export function CSNoelChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);

  const replyMutation = trpc.chat.reply.useMutation({
    onSuccess: (response) => {
      setConversationId(response.conversationId);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: response.reply },
      ]);
    },
    onError: () => {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I’m sorry—there was a problem connecting just now. Please try again, or use our facilities page to reach the CSNoel team.",
        },
      ]);
    },
  });

  const handleSend = (content: string) => {
    setMessages((current) => [...current, { role: "user", content }]);
    replyMutation.mutate({ conversationId, message: content });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Open CSNoel career assistant"
          className="fixed right-5 bottom-5 z-40 h-14 rounded-full bg-[#0b1f3a] px-5 text-white shadow-[0_18px_44px_rgba(11,31,58,0.34)] transition-all duration-200 hover:scale-[1.02] hover:bg-[#123766] active:scale-[0.97] sm:right-7 sm:bottom-7"
        >
          <MessageCircleMore className="mr-2 size-5" />
          <span className="font-semibold">Ask CSNoel</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1.25rem)] gap-0 overflow-hidden border-0 p-0 shadow-[0_28px_90px_rgba(6,24,49,0.28)] sm:max-w-[460px]" showCloseButton>
        <DialogHeader className="bg-[#0b1f3a] px-6 pt-6 pb-5 text-left">
          <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-[#3bd6c6] text-[#0b1f3a]">
            <Sparkles className="size-5" />
          </div>
          <DialogTitle className="text-xl tracking-tight text-white">
            Your CSNoel guide
          </DialogTitle>
          <DialogDescription className="max-w-[340px] text-sm leading-6 text-slate-300">
            Explore openings, clarify job details, or let us know how we can help.
          </DialogDescription>
        </DialogHeader>
        <AIChatBox
          messages={messages}
          onSendMessage={handleSend}
          isLoading={replyMutation.isPending}
          height="430px"
          className="rounded-none border-0 shadow-none"
          placeholder="Ask about roles, locations, or staffing…"
          emptyStateMessage="Start with a question. We’ll help you find the right next step."
          suggestedPrompts={SUGGESTED_PROMPTS}
        />
        <p className="border-t bg-slate-50 px-5 py-3 text-xs leading-5 text-slate-500">
          Please do not include patient information, health details, or other sensitive information in chat.
        </p>
      </DialogContent>
    </Dialog>
  );
}
