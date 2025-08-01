import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

const NewDocumentButton = () => {
  return (
    <Button className="gap-2 cursor-pointer">
      <PlusIcon size={18} />
      New Document
    </Button>
  );
};

export default NewDocumentButton;
