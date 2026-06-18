import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Overlay from "./routes/Overlay";
import Home from "./screens/Home";
import PetSelection from "./screens/PetSelection";
import Settings from "./screens/Settings";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<"home" | "petSelection" | "settings">("home");

  const renderMainScreen = () => {
    if (currentScreen === "petSelection") {
      return <PetSelection onBack={() => setCurrentScreen("home")} />;
    }
    if (currentScreen === "settings") {
      return <Settings onBack={() => setCurrentScreen("home")} />;
    }

    return (
      <Home
        onOpenPetSelection={() => setCurrentScreen("petSelection")}
        onOpenSettings={() => setCurrentScreen("settings")}
      />
    );
  };

  return (
    <Routes>
      <Route path="/overlay" element={<Overlay />} />
      <Route path="/home" element={renderMainScreen()} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}