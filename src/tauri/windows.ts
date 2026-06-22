import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Window } from "@tauri-apps/api/window";

export async function closeCurrentWindow() {
  await getCurrentWindow().close();
}

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
    shadow: false,
    resizable: false,

    alwaysOnTop: true,
    skipTaskbar: true,
  });

  win.once("tauri://error", (e) => {
    console.error("Failed to create overlay window:", e);
  });
}

export async function closeOverlayWindow() {
  const overlayWindow = await Window.getByLabel("overlay");

  if (!overlayWindow) {
    return;
  }

  await overlayWindow.close();
}
