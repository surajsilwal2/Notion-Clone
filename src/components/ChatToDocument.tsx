"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as Y from "yjs";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { BotIcon, MessageCircleCode } from 'lucide-react';
import Markdown from "react-markdown";

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    setQuestion(input);
    startTransition(async () => {
      try {
        const documentData = doc.get("document-store").toJSON();
        // Ensure NEXT_PUBLIC_BASE_URL is set in your Vercel project environment variables
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentData, question: input }),
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Chat error response:", errorText);
          throw new Error("Server returned error");
        }

        const { message } = await res.json();
        setInput("");
        setSummary(message);
        toast.success("Question asked Successfully");
      } catch (err: any) {
        console.error("Asking failed:", err);
        toast.error("Something went wrong while asking.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <MessageCircleCode className="mr-2 h-4 w-4" />
          Chat to Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Chat to Document</DialogTitle>
          <DialogDescription>
            Ask a question and chat to the document
          </DialogDescription>
          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>
        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100 mt-4 rounded">
            <div className="flex items-center gap-2">
              <BotIcon className="w-5 h-5" />
              <p className="font-bold">GPT Says:</p>
            </div>
            <Markdown>{summary}</Markdown>
          </div>
        )}
        <form onSubmit={handleAskQuestion} className="mt-4 space-y-4">
          <Input
            type="text"
            placeholder="i.e. what is this about?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full"
            required
          />
          <div className="flex justify-end">
            <Button
              variant={"outline"}
              type="submit"
              disabled={!input || isPending}
              className={`text-xl font-semibold px-5 py-2 rounded-md shadow-sm hover:bg-black hover:text-white disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isPending ? "Asking..." : "Ask"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatToDocument;
