import { app } from "./config";
import {
  doc,
  addDoc,
  setDoc,
  getDoc,
  getFirestore,
  collection,
  query,
  orderBy,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

// import {  } from "firebase/firestore/lite";

import CryptoJS from "crypto-js";
import { encrypt } from "./crypt";
import { roomMessages } from "$stores/app";

const db = getFirestore(app);

const getRand = () => {
  return (Math.random() + 1).toString(36).substring(6.5);
};

export const createRoom = async () => {
  const roomId = getRand().toUpperCase();
  const cryptedRoomId = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex);

  await setDoc(doc(db, "rooms", cryptedRoomId), {
    timestamp: Timestamp.fromDate(new Date()),
  });

  return roomId;
};

export const addMessage = async ({
  roomId,
  message,
}: {
  roomId: string;
  message: string;
}) => {
  const cryptedKey = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex);
  const cryptedDeviceDetails = CryptoJS.SHA256(navigator.userAgent).toString(
    CryptoJS.enc.Hex
  );

  const encryptedMessage = encrypt(cryptedKey, message);

  await addDoc(collection(db, "rooms", cryptedKey, "data"), {
    data: encryptedMessage,
    timestamp: new Date(),
    device: cryptedDeviceDetails,
  });
};

export const getRoomMessages = async (
  roomId: string,
  scrollToBottom: () => void
) => {
  const cryptedKey = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex);

  const dataCollection = collection(db, "rooms", cryptedKey, "data");

  const dataQuery = query(dataCollection, orderBy("timestamp"));

  onSnapshot(dataQuery, (snapshot) => {
    roomMessages.set(snapshot.docs.map((doc) => doc.data()) || []);

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  });
};

export const checkIfRoomExists = async (roomId: string) =>
  new Promise((resolve, reject) => {
    roomId = roomId.toUpperCase();

    const cryptedKey = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex);

    var docRef = doc(db, "rooms", cryptedKey);

    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        reject("Error getting document: " + error.message);
      });
  });

export const deleteRoom = async (roomId: string) => {
  roomId = roomId.toUpperCase();
  const cryptedKey = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex);
  const docRef = doc(db, "rooms", cryptedKey);
  await deleteDoc(docRef);
};
