import PixiStage from "../ui/PixiStage";
import { getCurrentWindow } from "@tauri-apps/api/window";

export default function Overlay() {
  const win = getCurrentWindow();
  
  return (
    <div 
      style={{ 
        width: "100vw", 
        height: "100vh", 
        background: "transparent",
        userSelect: "none",
      }}
      onPointerDownCapture={async (e) => {
        // left click to drag window
        if (e.button !== 0) return;

        e.preventDefault();

        try {
          // focus window first
          await win.setFocus();
          await win.startDragging();
        } catch (err) {
          console.error("Drag failed:", err);
        }
      }}
    >
      <PixiStage />
    </div>
  );
}
