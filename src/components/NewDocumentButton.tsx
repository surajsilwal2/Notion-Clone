"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

//something that is asynchronous and don't need imidiately we use useTransition
import { useTransition } from "react";

import { createNewDocument } from "@/actions/actions";

const NewDocumentButton = () => {
  const router = useRouter();

  //useTransition provides isPending and startTrasnsition
  const [isPending, startTrasnsition] = useTransition();

  function handleCreateNewDocument() {
    startTrasnsition(async () => {
      const { docId } = await createNewDocument(); // here the docId is coming from action. the docId is the same  id of the documents collection
      router.push(`/doc/${docId}`);
    });
  }

  return (
    <Button
      onClick={handleCreateNewDocument}
      disabled={isPending} //it will be disabled if it is not pending
      className="gap-2 cursor-pointer"
    >
      <PlusIcon size={18} />
      {isPending ? "Creating..." : "New Document"}
    </Button>
  );
};

export default NewDocumentButton;
