import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex items-center gap-4 px-4 py-4 justify-center">
        <h1 className="font-bold  ">
          Welcome to new Brand Learning Course
        </h1>
        <Button className="cursor-pointer">OnBoard to Super Class Lesson</Button>
      </div>
    </>
  );
}
