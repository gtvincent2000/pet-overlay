import { useEffect } from "react";
import PixiStage from "../ui/PixiStage";
import { getCurrentWindow, LogicalPosition } from "@tauri-apps/api/window";
import { getStoredSelectedPet } from "../data/petStorage";

const KEY = "overlay-position";

export default function Overlay() {
  const win = getCurrentWindow();
  const selectedPet = getStoredSelectedPet();

  // Restore once when overlay mounts
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) return;

    try {
      const { x, y } = JSON.parse(saved) as { x: number; y: number };
      void win.setPosition(new LogicalPosition(x, y));
    } catch (err) {
      console.warn("Failed to restore overlay position:", err);
    }
  }, [win]);

  // Save whenever window moves (debounced)
  useEffect(() => {
    let t: number | undefined;

    const unlistenPromise = win.onMoved(({ payload }) => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        localStorage.setItem(KEY, JSON.stringify(payload));
      }, 120);
    });

    return () => {
      if (t) window.clearTimeout(t);
      void unlistenPromise.then((unlisten) => unlisten());
    };
  }, [win]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "transparent",
        userSelect: "none",
      }}
      onPointerDownCapture={async (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        await win.setFocus();
        await win.startDragging();
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          color: "white",
          background: "rgba(0, 0, 0, 0.5)",
          padding: "4px 8px",
          borderRadius: 4,
          fontSize: 12,
          pointerEvents: "none",
        }}
      >
        Selected Pet: {selectedPet}
      </div>
      
      <PixiStage />
    </div>
  );
}
