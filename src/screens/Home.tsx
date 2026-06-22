import { openOverlayWindow, closeCurrentWindow } from "../tauri/windows";
import PixelPanel from "../ui/PixelPanel";
import PixelButton from "../ui/PixelButton";

type HomeProps = {
  onOpenPetSelection: () => void;
  onOpenSettings: () => void;
};

export default function Home({ onOpenPetSelection, onOpenSettings }: HomeProps) {
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
              <PixelButton onClick={onOpenPetSelection}>
                Change Pet
              </PixelButton>
              <PixelButton onClick={onOpenSettings}>
                Settings
              </PixelButton>
              <PixelButton onClick={closeCurrentWindow}>
                Close Menu
              </PixelButton>
            </div>
          </PixelPanel>
        </main>
      </div>
    </div>
  );
}
