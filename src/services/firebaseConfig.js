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
  apiKey: "AIzaSyApDqK1GqXV00bpAcZ_yIfUjkLHyTTpzWs",
  authDomain: "lista-de-tarefas-63f30.firebaseapp.com",
  projectId: "lista-de-tarefas-63f30",
  storageBucket: "lista-de-tarefas-63f30.firebasestorage.app",
  messagingSenderId: "623338366984",
  appId: "1:623338366984:web:9af314e9f3396d57e649bd",
  measurementId: "G-ENL4KRP6FT",
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
