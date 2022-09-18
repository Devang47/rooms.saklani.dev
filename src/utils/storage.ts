import { loading } from "$stores/app";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { get } from "svelte/store";
import { app } from "./config";
import { addNotification } from "./notifications";
import CryptoJS from "crypto-js";

export const uploadFile = (roomId: string, file: any) =>
  new Promise((resolve, reject) => {
    const cryptedKey = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex);

    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      cryptedKey + "/" + CryptoJS.SHA256(file.name).toString(CryptoJS.enc.Hex)
    );

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (snapshot.totalBytes > 20485760) {
          uploadTask.cancel();
          loading.set(false);

          addNotification("File size exceeds 20mb limit!", true);
          return;
        }
      },
      (error) => {
        loading.set(false);
        addNotification("Error while uploading file!", true);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((e) => {
          loading.set(false);
          resolve(e);
        });
      }
    );
  });
