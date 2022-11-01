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
import axios from "axios";

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
        getDownloadURL(uploadTask.snapshot.ref).then(async (e) => {
          loading.set(false);
          resolve(await minifyURL(e));
        });
      }
    );
  });

export const minifyURL = async (e: string) =>
  new Promise((resolve, reject) => {
    var data = {
      domain: "links.saklani.dev",
      originalURL: e,
    };
    fetch("https://api.short.io/links/public", {
      method: "post",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: import.meta.env.VITE_SHORTIO_API_KEY,
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        resolve(data.shortURL);
      });
  });
