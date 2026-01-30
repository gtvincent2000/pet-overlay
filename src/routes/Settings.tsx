import { openOverlayWindow } from "../tauri/windows";

export default function Settings() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Pet Overlay – Settings</h1>
      <p>We’ll build customization here.</p>
      <button onClick={openOverlayWindow}>Open Overlay</button>
    </div>
  );
}
