import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { collectionGroup, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";


// custom hook to check if the current user is the room owner
const useOwner = () => {
  const { user } = useUser();
  const room = useRoom();
  const [isOwner, setIsOwner] = useState(false);

  // firebase query to get all users in the room
  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  useEffect(() => {
    if (usersInRoom?.docs && usersInRoom.docs.length > 0) {
      const owners = usersInRoom.docs.filter(
        (doc) => doc.data().role === "owner"
      );
      if (
        owners.some(
          (owner) => owner.data().userId === user?.emailAddresses[0].toString()
        )
      ) {
        setIsOwner(true);
      }
    }
  }, [usersInRoom, user]);

  return isOwner;
};

export default useOwner;
