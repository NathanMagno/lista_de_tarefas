import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  onSnapshot,
  serverTimestamp,
  query,
  updateDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  "insira suas credenciais do firebase aqui"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export {
  app,
  auth,
  db,
  collection,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  onSnapshot,
  serverTimestamp,
  query,
  getAuth,
  updateDoc,
};
