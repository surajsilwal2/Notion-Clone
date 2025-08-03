"use client";
import React, { useEffect, useState } from "react";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import {
  DocumentData,
  collectionGroup,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import SidebarOptions from "./SidebarOptions";

// define the shape of room documents stored in Firestore
interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

const Sidebar = () => {
  const { user } = useUser();

  //Holds documents grouped by user role
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });

  //fetch documents from all 'rooms' collections where user is involved
  const [data, loading, error] = useCollection(
    // only run the query if user is logged in
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.primaryEmailAddress?.emailAddress)
      )
  );

  useEffect(() => {
    if (!data) return;

    //grouped the documents based on whether user is owner or editor
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;

        if (roomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData,
          });
        }
        return acc;
      },
      {
        owner: [],
        editor: [],
      }
    );
    setGroupedData(grouped);
  }, [data]);

  //define the sidebar UI structure (used in both mobile and desktop)
  const menuOptions = (
    <div className="space-y-4">
      <NewDocumentButton />

      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {/* My Documents */}
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            No Documents found
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              My Documents
            </h2>
            {groupedData.owner.map((doc) => (
              <SidebarOptions
                key={doc.id}
                id={doc.id}
                href={`/doc/${doc.id}`}
              />
            ))}
          </>
        )}
      </div>

      {/* Shared with me */}
      {groupedData.editor.length > 0 && (
        <>
          <h2 className="text-gray-500 font-semibold text-sm ">
            Shared with Me
          </h2>
          {groupedData.editor.map((doc) => (
            <SidebarOptions key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
          ))}
        </>
      )}
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
              <SheetTitle className="text-xl font-bold text-gray-800">
                Menu
              </SheetTitle>
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
