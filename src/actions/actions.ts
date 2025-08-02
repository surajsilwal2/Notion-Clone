"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../../firebase-admin";

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
