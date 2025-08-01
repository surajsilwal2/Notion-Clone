import React from "react";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

const Sidebar = () => {
  const menuOptions = (
    <div className="space-y-4">
      <NewDocumentButton />
      {/* Add more menu buttons here if needed */}
    </div>
  );

  return (
    <aside className="p-4 md:p-6 bg-gray-100 min-h-screen shadow-md">
      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="focus:outline-none">
            <MenuIcon
              className="text-gray-700 hover:opacity-70 transition-opacity rounded-lg"
              size={36}
            />
          </SheetTrigger>

          <SheetContent side="left" className="bg-white w-64">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-xl font-bold text-gray-800">Menu</SheetTitle>
            </SheetHeader>
            {menuOptions}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">{menuOptions}</div>
    </aside>
  );
};

export default Sidebar;
