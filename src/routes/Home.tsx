import { openOverlayWindow } from "../tauri/windows";
import PixelPanel from "../ui/PixelPanel";
import PixelButton from "../ui/PixelButton";

export default function Home() {
  return (
    <div className="home-page">
      {/* Header Content */}
      <header className="home-header">
        <h1>Overlay Pet</h1>
        <p>Desktop Companion Settings</p>
      </header>

      {/* Sidebar Settings Selection */}
      <div className="home-layout">
        <aside className="home-sidebar">
          <PixelButton>Pet</PixelButton>
          <PixelButton>Overlay</PixelButton>
          <PixelButton>Timer</PixelButton>
          <PixelButton>About</PixelButton>
        </aside>
      
        {/* Primary Content */}
        <main className="home-content">
          <PixelPanel>
            <h2>Welcome</h2>

            <p>
              TODO: Configure pet overlay behavior
            </p>

            <PixelButton onClick={openOverlayWindow}>
              Open Overlay
            </PixelButton>
          </PixelPanel>
        </main>
      </div>
    </div>
  );
}
