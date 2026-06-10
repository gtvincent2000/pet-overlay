import { openOverlayWindow } from "../tauri/windows";
import PixelPanel from "../ui/PixelPanel";

export default function Settings() {
  return (
    <div className="settings-page">
      {/* Header Content */}
      <header className="settings-header">
        <h1>Overlay Pet</h1>
        <p>Desktop Companion Settings</p>
      </header>

      {/* Sidebar Settings Selection */}
      <div className="settings-layout">
        <aside className="settings-sidebar">
          <button>Pet</button>
          <button>Overlay</button>
          <button>Timer</button>
          <button>About</button>
        </aside>
      
        {/* Primary Content */}
        <main className="settings-content">
          <PixelPanel>
            <h2>Welcome</h2>

            <p>
              TODO: Configure pet overlay behavior
            </p>

            <button onClick={openOverlayWindow}>
              Open Overlay
            </button>
          </PixelPanel>
        </main>
      </div>
    </div>
  );
}
