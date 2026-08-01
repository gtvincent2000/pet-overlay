import {
  DEFAULT_OVERLAY_DISPLAY_MODE,
  isOverlayDisplayMode,
  type OverlayDisplayMode,
} from "./overlayDisplay";

const OVERLAY_DISPLAY_MODE_STORAGE_KEY = "overlayDisplayMode";

export function getStoredOverlayDisplayMode(): OverlayDisplayMode {
  const savedMode = localStorage.getItem(OVERLAY_DISPLAY_MODE_STORAGE_KEY);

  if (isOverlayDisplayMode(savedMode)) {
    return savedMode;
  }

  return DEFAULT_OVERLAY_DISPLAY_MODE;
}

export function saveOverlayDisplayMode(mode: OverlayDisplayMode) {
  localStorage.setItem(OVERLAY_DISPLAY_MODE_STORAGE_KEY, mode);
}