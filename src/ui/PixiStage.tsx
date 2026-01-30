import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

export default function PixiStage() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const app = new Application();
    let cancelled = false;
    let initialized = false;

    const safeDestroy = () => {
      // Only destroy if init finished (otherwise Pixi may touch app.canvas and crash)
      if (!initialized) return;

      try {
        // Remove canvas if mounted
        if (app.canvas?.parentElement) {
          app.canvas.parentElement.removeChild(app.canvas);
        }
        app.destroy(true);
      } catch (e) {
        console.warn("Pixi safeDestroy warning:", e);
      }
    };

    (async () => {
      await app.init({
        resizeTo: host,
        backgroundColor: 0x00ff00, // debug green
        backgroundAlpha: 1,
        antialias: false,
      });

      initialized = true;

      // If React already cleaned up (StrictMode/dev), tear down safely and exit
      if (cancelled) {
        safeDestroy();
        return;
      }

      host.appendChild(app.canvas);

      const g = new Graphics();
      g.rect(50, 50, 100, 100).fill(0x0000ff); // debug blue square
      app.stage.addChild(g);

      console.log("Pixi running", app.renderer.width, app.renderer.height);
    })();

    return () => {
      cancelled = true;
      safeDestroy();
    };
  }, []);

  return <div ref={hostRef} style={{ width: "100%", height: "100%" }} />;
}
