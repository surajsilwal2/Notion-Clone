"use client";
import * as Y from "yjs";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown"; 

type Language =
  | "english"
  | "spanish"
  | "portuguese"
  | "french"
  | "german"
  | "chinese"
  | "arabic"
  | "hindi"
  | "russian"
  | "japanese"
  | "nepali";

const languages: Language[] = [
  "english",
  "spanish",
  "portuguese",
  "french",
  "german",
  "chinese",
  "arabic",
  "hindi",
  "russian",
  "japanese",
  "nepali",
];

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  async function handleAskQuestion(e: FormEvent) {
    e.preventDefault();
    setSummary("");
    setError("");

    startTransition(async () => {
      try {
        const documentData = doc.get("document-store").toJSON();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentData, targetLang: language }),
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Translation error response:", errorText);
          throw new Error("Server returned error");
        }

        const data = await res.json();

        if (!data.translated_text) {
          toast.error("Translation failed: No result.");
          return;
        }

        setSummary(data.translated_text);
        toast.success("Translated Summary Successfully");
      } catch (err: any) {
        console.error("Translation failed:", err);
        setError("Something went wrong while translating.");
        toast.error("Something went wrong while translating.");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <LanguagesIcon className="w-5 h-5" />
          Translate
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white text-gray-900 border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Translate the Document</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Select a language and AI will translate a summary of the document in that language.
          </DialogDescription>
        </DialogHeader>

        {isPending && (
          <div className="flex items-center gap-2 mt-4 text-gray-700">
            <BotIcon className="w-6 h-6 animate-bounce" />
            <p>GPT is thinking...</p>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}

        {summary && !isPending && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100 mt-4 rounded">
            <div className="flex items-center gap-2">
              <BotIcon className="w-5 h-5" />
              <p className="font-bold">GPT Says:</p>
            </div>
            <Markdown>{summary}</Markdown>
          </div>
        )}

        <form onSubmit={handleAskQuestion} className="mt-6 space-y-4">
          <Select value={language} onValueChange={(value) => setLanguage(value)}>
            <SelectTrigger className="w-full bg-white text-black border border-gray-300">
              <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black z-[101] shadow-lg">
              {languages.map((lang) => (
                <SelectItem
                  key={lang}
                  value={lang}
                  className="hover:bg-gray-100 focus:bg-gray-100 text-black"
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!language || isPending}
              className="bg-black text-white font-bold px-6 py-2 rounded-md shadow-md hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isPending ? "Translating..." : "Translate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TranslateDocument;