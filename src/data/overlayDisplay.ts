export type OverlayDisplayMode = "clock" | "timer";

export const DEFAULT_OVERLAY_DISPLAY_MODE: OverlayDisplayMode = "clock";

export function isOverlayDisplayMode(
  value: string | null
): value is OverlayDisplayMode {
  return value === "clock" || value === "timer";
}

export function getNextOverlayDisplayMode(
  currentMode: OverlayDisplayMode
): OverlayDisplayMode {
  return currentMode === "clock" ? "timer" : "clock";
}