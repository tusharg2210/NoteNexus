import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKey,
    authDomain: import.meta.env.VITE_AuthDomain,
    databaseURL: import.meta.env.VITE_DatabaseURL,
    projectId: import.meta.env.VITE_ProjectId,
    storageBucket: import.meta.env.VITE_StorageBucket,
    messagingSenderId: import.meta.env.VITE_MessagingSenderId,
    appId: import.meta.env.VITE_AppId,
    measurementId: import.meta.env.VITE_MeasurementId
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);