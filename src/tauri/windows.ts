import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export async function openOverlayWindow() {
  const existing = await WebviewWindow.getByLabel("overlay");
  if (existing) {
    await existing.setFocus();
    return;
  }

  const win = new WebviewWindow("overlay", {
    url: "/#/overlay",
    title: "Overlay",
    width: 420,
    height: 220,
    decorations: false,
    transparent: true,
    alwaysOnTop: true,
  });

  win.once("tauri://error", (e) => {
    console.error("Failed to create overlay window:", e);
  });
}
