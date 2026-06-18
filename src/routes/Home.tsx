import { openOverlayWindow } from "../tauri/windows";
import PixelPanel from "../ui/PixelPanel";
import PixelButton from "../ui/PixelButton";

export default function Home() {
  return (
    <div className="home-page">
      {/* Header Content */}
      <header className="home-header">
        <h1>Overlay Companion</h1>
      </header>

      {/* Sidebar Settings Selection */}
      <div className="home-layout">
        {/* Primary Content */}
        <main className="home-content">
          <PixelPanel>
            <div className="home-menu">
              <PixelButton onClick={openOverlayWindow}>
                Open Overlay
              </PixelButton>
              <PixelButton>
                Change Pet
              </PixelButton>
              <PixelButton>
                Settings
              </PixelButton>
            </div>
          </PixelPanel>
        </main>
      </div>
    </div>
  );
}
