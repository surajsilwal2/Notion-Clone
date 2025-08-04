"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../../firebase-admin";
import liveblocks from "@/lib/liveblocks";

export async function createNewDocument() {
  // Protects the route: redirects to sign-in if the user is not authenticated
  auth.protect();

  // Retrieves session claims (customized claims from Clerk's JWT)
  const { sessionClaims } = await auth();

  // Extract the user's email from sessionClaims (custom JWT claims)
  const userEmail = sessionClaims?.email;

  if (!userEmail) {
    throw new Error("User email not found in session claims");
  }

  // Create a reference to the "documents" collection in Firestore
  const docCollectionRef = adminDb.collection("documents");

  // Add a new document with a default title
  const docRef = await docCollectionRef.add({
    title: "New Doc",
  });

  // Add the created document to the user's "rooms" subcollection
  await adminDb
    .collection("users")
    .doc(userEmail)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: userEmail,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  /**
   * Explanation:
   * After creating the document, we also register that document under the current user's account.
   * - We're creating a "rooms" subcollection under the user.
   * - The document ID inside "rooms" matches the newly created document's ID.
   * - We use `set` to overwrite or create the room entry for this user.
   * This allows us to easily query which documents/rooms a user owns.
   */

  return { docId: docRef.id };
}


// deleting a document from firestore, removes all user room references, and deletes the liveblocks room
export async function deleteDocument(roomId: string) {
  
  // ensures only authenticated users can call this
  auth.protect();

  try {
    // step 1: delete the main document from the 'documents' collection
    await adminDb.collection("documents").doc(roomId).delete();

    //step 2: find all user room references linked to this room
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch(); // Firestore batched writes provide a mechanism to perform multiple write operations (set, update, or delete) atomically as a single unit. This means that either all operations within the batch succeed, or if any operation fails, the entire batch is rolled back, and no changes are applied. This ensures data consistency and prevents partial updates.

    //step 3:  delete every 'room' subdocument that references  this room 
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // step 4: commit all deletions
    await batch.commit();

    //step 5:  delete the Liveblocks room(realtime session)
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
