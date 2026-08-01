import { useEffect, useState } from "react";
import PixiStage from "../ui/PixiStage";
import { getCurrentWindow, LogicalPosition } from "@tauri-apps/api/window";
import { getStoredSelectedPet } from "../data/petStorage";
import { listen } from "@tauri-apps/api/event";
import type { PetName } from "../data/pets";
import { SELECTED_PET_CHANGED_EVENT } from "../data/petEvents";
import OverlayStatusDisplay from "../ui/OverlayStatusDisplay";

const KEY = "overlay-position";

export default function Overlay() {
  const win = getCurrentWindow();
  const [selectedPet, setSelectedPet] = useState<PetName>(getStoredSelectedPet);

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

  useEffect(() => {
    const setupListener = async () => {
      const unlisten = await listen<PetName>(
        SELECTED_PET_CHANGED_EVENT,
        (event) => {
          setSelectedPet(event.payload);
        }
      );

      return unlisten;
    };

    let cleanup: (() => void) | undefined;

    setupListener().then((unlisten) => {
      cleanup = unlisten;
    });

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div
      className="overlay-root"
      onPointerDownCapture={async (event) => {
        if (event.button !== 0) return;

        const target = event.target as HTMLElement;

        if (target.closest("[data-overlay-interactive='true']")) {
          return;
        }

        event.preventDefault();
        await win.setFocus();
        await win.startDragging();
      }}
    >
      <PixiStage selectedPet={selectedPet} bottomOffset={62} />
      <OverlayStatusDisplay />
    </div>
  );
}
