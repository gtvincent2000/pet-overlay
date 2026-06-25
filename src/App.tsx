import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { PetName } from "./data/pets";
import { getStoredSelectedPet, saveSelectedPet } from "./data/petStorage";
import Overlay from "./routes/Overlay";
import Home from "./screens/Home";
import PetSelection from "./screens/PetSelection";
import Settings from "./screens/Settings";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<"home" | "petSelection" | "settings">("home");

  const [selectedPet, setSelectedPet] = useState<PetName>(getStoredSelectedPet);

  useEffect(() => {
    saveSelectedPet(selectedPet);
  }, [selectedPet]);

  const renderMainScreen = () => {
    if (currentScreen === "petSelection") {
      return (
        <PetSelection
          onBack={() => setCurrentScreen("home")}
          selectedPet={selectedPet}
          onSelectPet={setSelectedPet}
        />
      );
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