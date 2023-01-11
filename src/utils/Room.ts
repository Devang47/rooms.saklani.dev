import { analytics, app } from "./config";
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
  getDocs,
} from "firebase/firestore";
import { logEvent } from "firebase/analytics";

// import {  } from "firebase/firestore/lite";

import CryptoJS from "crypto-js";
import { encrypt } from "./crypt";
import { roomMessages } from "$stores/app";
import { getStorage, listAll, ref, deleteObject } from "firebase/storage";

const db = getFirestore(app);
const storage = getStorage(app);

const getRand = (() => {
  const gen = (min: number, max: number) =>
    max++ && [...Array(max - min)].map((s, i) => String.fromCharCode(min + i));

  const sets = {
    num: gen(48, 57),
    alphaLower: gen(97, 122),
    alphaUpper: gen(65, 90),
    special: [...``],
  };

  function* iter(len: number, set: any) {
    if (set.length < 1) set = Object.values(sets).flat();
    for (let i = 0; i < len; i++) yield set[(Math.random() * set.length) | 0];
  }

  return Object.assign(
    (len: number, ...set: any) => [...iter(len, set.flat())].join(""),
    sets
  );
})();

export const createRoom = async () => {
  const roomId = getRand(6).toUpperCase();
  const cryptedRoomId = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex);

  await setDoc(doc(db, "rooms", cryptedRoomId), {
    timestamp: new Date().getTime(),
  });

  logEvent(analytics, "room_created");

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
    timestamp: new Date().getTime(),
    device: cryptedDeviceDetails,
  });

  logEvent(analytics, "message_pushed");
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
          resolve(doc.data());
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        reject("Error getting document: " + error.message);
      });

    logEvent(analytics, "check_for_room_existance");
  });

export const deleteRoom = async (roomId: string) => {
  roomId = roomId.toUpperCase();
  const cryptedKey = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex);

  const filesRef = ref(storage, cryptedKey + "/");
  const files = await listAll(filesRef);

  files.items.forEach(async (e) => {
    // @ts-ignore
    let path = e._location.path;

    const filesRef = ref(storage, path);
    await deleteObject(filesRef);
  });

  const docRef = doc(db, "rooms", cryptedKey);

  const q = query(collection(db, "rooms", cryptedKey, "data"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doData) => {
    await deleteDoc(doc(db, "rooms", cryptedKey, "data", doData.id));
  });

  await deleteDoc(docRef);
  logEvent(analytics, "room_deleted");
};
