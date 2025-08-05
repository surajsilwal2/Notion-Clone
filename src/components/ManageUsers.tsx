"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/useOwner"; // Custom hook to check if current user is owner
import { useRoom } from "@liveblocks/react/suspense";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { removeUserFromDocument } from "@/actions/actions";
import { useRouter } from "next/navigation";

const ManageUsers = () => {
  const { user } = useUser(); // Get logged-in user
  const room = useRoom(); // Get current liveblocks room
  const isOwner = useOwner(); // Check if current user is owner

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const router = useRouter();

  const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

  const [otherDocs, loading] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", currentUserEmail)
      )
  );

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const handleDelete = async (userId: string) => {
    if (!user) return;
    setRemovingUserId(userId);

    startTransition(async () => {
      const { success } = await removeUserFromDocument(room.id, userId);

      setRemovingUserId(null);

      if (success) {
        toast.success("User removed from the room successfully");
      } else {
        toast.error("Failed to remove user from room!");
      }
    });
  };

  useEffect(() => {
    if (!user || !usersInRoom || !otherDocs) return;

    const hasAccessToCurrent = usersInRoom.docs.some(
      (doc) => doc.data().userId === currentUserEmail
    );

    if (!hasAccessToCurrent) {
      toast.error("You have been removed from this document");

      const otherDoc = otherDocs.docs.find((doc) => doc.id !== room.id);
      if (otherDoc) {
        router.push(`/doc/${otherDoc.id}`);
      } else {
        router.push("/");
      }
    }
  }, [usersInRoom, otherDocs, user]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          Users ({usersInRoom?.docs.length || 0})
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Users with Access</DialogTitle>
          <DialogDescription>
            Below is a list of users who have access to this document.
          </DialogDescription>
        </DialogHeader>

        <hr className="my-2" />

        <div className="flex flex-col space-y-3">
          {usersInRoom?.docs.map((doc) => {
            const userId = doc.data().userId;
            const role = doc.data().role;
            const currentUserEmail = user?.primaryEmailAddress?.emailAddress;
            const isCurrentUser = userId === currentUserEmail;

            return (
              <div
                key={userId}
                className="flex items-center justify-between border rounded-md px-3 py-2"
              >
                <div className="text-sm text-gray-800 truncate max-w-[160px]">
                  {isCurrentUser ? `You (${userId})` : userId}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs capitalize"
                  >
                    {role}
                  </Button>

                  {isOwner && !isCurrentUser && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(userId)}
                      disabled={removingUserId === userId}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    >
                      {removingUserId === userId ? "Removing..." : "Remove"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageUsers;
