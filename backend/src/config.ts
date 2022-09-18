import { initializeApp } from "firebase/app";
import { Env } from ".";

export const getFirebaseApp = (env: Env) => {
  const firebaseConfig = {
    apiKey: env.API_KEY,
    authDomain: env.AUTH_DOMAIN,
    projectId: env.PROJECT_ID,
    storageBucket: env.STORAGE_BUCKET,
    messagingSenderId: env.SENDER_ID,
    appId: env.APP_ID,
    measurementId: env.MEASUREMENT_ID,
  };

  return initializeApp(firebaseConfig);
};
