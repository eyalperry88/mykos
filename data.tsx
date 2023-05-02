// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, listAll, ref, uploadString } from "firebase/storage";
import * as Crypto from 'expo-crypto';
import arrayBufferToHex from 'array-buffer-to-hex';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDslngmIJdFkSPbFZNoVunEKL9emREtx_o",
  authDomain: "mykos-fd657.firebaseapp.com",
  projectId: "mykos-fd657",
  storageBucket: "mykos-fd657.appspot.com",
  messagingSenderId: "265952938889",
  appId: "1:265952938889:web:9df5c6f8a0988e40782f58",
  measurementId: "G-32L49GMMHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const hashStr = async (str: string):Promise<string> => {
  const buf = new TextEncoder().encode(str);
  const digest = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, buf);
  const result = arrayBufferToHex(digest); 
  return result;
}

export async function uploadPhotoToFirebase(pid: string, photoDataStr: string): Promise<any> {
  try {
    if (pid.trim() && photoDataStr) {
      const filename = await hashStr(pid);

      var imageRef = ref(storage, "garden/" + filename + ".jpg");

      const ret = await uploadString(imageRef, photoDataStr, 'data_url');

      return ret;
    }
  } catch (error) {
      console.log("ERR ===", error);
      alert("Image uploading failed!");
      return null;
  }
}

function shuffleArray(array: Array<any>) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

export async function loadPhotos(): Promise<Array<string>> {
    let listRef = ref(storage, "garden/");
    const ret = await listAll(listRef);

    let results:string[] = [];

    await Promise.all(ret.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      results.push(url);
    }));

    shuffleArray(results);

    return results;
}