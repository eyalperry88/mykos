import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CameraPage from "./pages/CameraPage";
import HomePage from "./pages/HomePage";



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


// let root = createRoot(document.getElementById('root') as HTMLElement);
// root.render(
//   <React.StrictMode>
//       <App />
//   </React.StrictMode>,
// );