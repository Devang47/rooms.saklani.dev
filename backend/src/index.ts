import { getFirebaseApp } from "./config";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
  Timestamp,
  deleteDoc,
} from "firebase/firestore/lite";

export interface Env {
  API_KEY: string;
  AUTH_DOMAIN: string;
  PROJECT_ID: string;
  STORAGE_BUCKET: string;
  SENDER_ID: string;
  APP_ID: string;
  MEASUREMENT_ID: string;
}

async function deleteRoom(db: any, cryptedKey: string) {
  const docRef = doc(db, "rooms", cryptedKey);
  await deleteDoc(docRef);
}

async function getRooms(db: any) {
  const q = query(collection(db, "rooms"));
  const querySnapshot = await getDocs(q);

  const documents: any[] = [];
  querySnapshot.forEach((doc) => {
    documents.push({ _id: doc.id, ...doc.data() });
  });

  return documents;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const app = getFirebaseApp(env);
    const db = getFirestore(app);

    const docs = await getRooms(db);

    docs.forEach((e) => {
      const dateBefore15Min = new Date(new Date().getTime() - 15 * 60000);
      const docDate = new Date(e.timestamp.seconds * 1000);

      if (docDate < dateBefore15Min) {
        deleteRoom(db, e._id);
      }
    });

    return new Response("Done");
  },
};
