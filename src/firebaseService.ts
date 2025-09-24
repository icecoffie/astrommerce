// src/services/firebaseService.ts
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "./firebaseConfig";

const db = getFirestore(app);

export const savePerformance = async (data: {
  userId: string;
  challengeId: number;
  points: number;
}) => {
  try {
    await addDoc(collection(db, "performances"), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error("❌ Gagal simpan performance:", err);
    return false;
  }
};

export const getPerformances = async () => {
  try {
    const snapshot = await getDocs(collection(db, "performances"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("❌ Gagal ambil data performance:", err);
    return [];
  }
};
