import { Routes, Route, Navigate } from "react-router-dom";
import Overlay from "./routes/Overlay";
import Home from "./routes/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/overlay" element={<Overlay />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
