import { openOverlayWindow, closeOverlayWindow, hideCurrentWindow } from "../tauri/windows";
import PixelPanel from "../ui/PixelPanel";
import MenuButton from "../ui/MenuButton";

type HomeProps = {
  onOpenPetSelection: () => void;
  onOpenSettings: () => void;
};

export default function Home({ onOpenPetSelection }: HomeProps) {
  return (
    <div className="home-page">

      {/* Button Selection */}
      <div className="home-layout">
        {/* Primary Content */}
        <main className="home-content">
            <div className="home-menu">
              <MenuButton onClick={openOverlayWindow}>
                Open Overlay
              </MenuButton>
              <MenuButton onClick={closeOverlayWindow}>
                Close Overlay
              </MenuButton>
              <MenuButton onClick={onOpenPetSelection}>
                Change Pet
              </MenuButton>
              <MenuButton onClick={hideCurrentWindow}>
                Close Menu
              </MenuButton>
            </div>
        </main>
      </div>
    </div>
  );
}
