import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CameraPage from "./pages/CameraPage";
import HomePage from "./pages/HomePage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const analytics = getAnalytics(app);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="upload" element={<CameraPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}


let root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
);