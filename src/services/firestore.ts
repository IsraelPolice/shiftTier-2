import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BreakSlot } from '../types';
import { getDefaultBreaks } from '../utils/auth';

export const initializeBreaks = async (date: string): Promise<BreakSlot[]> => {
  const defaultBreaks = getDefaultBreaks();
  try {
    const breaksCollection = await getDocs(collection(db, `breaks-${date}`));
    const fetchedBreaks = breaksCollection.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BreakSlot[];

    const mergedBreaks = defaultBreaks.map((defaultBreak, index) => {
      const existingBreak = fetchedBreaks.find(
        (breakSlot) => breakSlot.id === `break-${index}`
      );
      if (existingBreak) {
        return existingBreak;
      }
      setDoc(doc(db, `breaks-${date}`, `break-${index}`), defaultBreak);
      return { id: `break-${index}`, ...defaultBreak };
    });

    return mergedBreaks.sort((a, b) => a.time.localeCompare(b.time));
  } catch (error) {
    console.error("Error initializing breaks:", error);
    throw error;
  }
};

export const subscribeToBreaks = (
  date: string,
  callback: (breaks: BreakSlot[]) => void,
  errorCallback: (error: Error) => void
) => {
  const defaultBreaks = getDefaultBreaks();
  
  return onSnapshot(
    collection(db, `breaks-${date}`),
    (snapshot) => {
      const fetchedBreaks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BreakSlot[];

      const mergedBreaks = defaultBreaks.map((defaultBreak, index) => {
        const existingBreak = fetchedBreaks.find(
          (breakSlot) => breakSlot.id === `break-${index}`
        );
        return existingBreak || { id: `break-${index}`, ...defaultBreak };
      });

      callback(mergedBreaks.sort((a, b) => a.time.localeCompare(b.time)));
    },
    errorCallback
  );
};

export const updateBreak = async (date: string, index: number, breakData: BreakSlot) => {
  try {
    await setDoc(doc(db, `breaks-${date}`, `break-${index}`), breakData);
  } catch (error) {
    console.error("Error updating break:", error);
    throw error;
  }
};

export const deleteBreak = async (date: string, index: number) => {
  try {
    await deleteDoc(doc(db, `breaks-${date}`, `break-${index}`));
  } catch (error) {
    console.error("Error deleting break:", error);
    throw error;
  }
};