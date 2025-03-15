import { loading, loadingUpload } from "$stores";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { app } from "../utils/config";
import { addNotification } from "../utils/notifications";
import CryptoJS from "crypto-js";
import { gsap } from "gsap";

export const uploadFile = (roomId: string, file: any) =>
  new Promise((resolve, reject) => {
    const cryptedKey = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex);

    const storage = getStorage(app);
    const storageRef = ref(storage, cryptedKey + "/" + file.name);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (snapshot.totalBytes > 204857600) {
          uploadTask.cancel();
          loading.set(false);
          loadingUpload.set(false);

          addNotification("File size exceeds 20mb limit!", true);
          return;
        }

        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        gsap.to(".loading-bar-width", {
          width: Math.max(progress, 30) + "%",
        });
      },
      (error) => {
        loading.set(false);
        loadingUpload.set(false);
        addNotification("Error while uploading file!", true);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (e) => {
          loading.set(false);
          loadingUpload.set(false);
          resolve(e);
        });
      },
    );
  });

export const minifyURL = async (e: string) =>
  new Promise((resolve, reject) => {
    var data = {
      url: e,
      domain: "tiny.one",
    };

    fetch("https://api.tinyurl.com/create", {
      method: "post",
      headers: {
        accept: "application/json",
        "content-Type": "application/json",
        authorization: `Bearer ${import.meta.env.VITE_SHORTIO_API_KEY}`,
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        resolve(data.data.tiny_url);
      });
  });
