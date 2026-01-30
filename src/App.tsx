import { Routes, Route, Navigate } from "react-router-dom";
import Overlay from "./routes/Overlay";
import Settings from "./routes/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/overlay" element={<Overlay />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/settings" replace />} />
    </Routes>
  );
}
