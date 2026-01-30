import { useEffect, useRef } from "react";
import { Application, Assets, Sprite, TextureStyle } from "pixi.js";

TextureStyle.defaultOptions.scaleMode = "nearest"; // global default for crisp pixel scaling :contentReference[oaicite:2]{index=2}

export default function PixiStage() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const app = new Application();
    let cancelled = false;
    let initialized = false;

    const safeDestroy = () => {
      if (!initialized) return;

      try {
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
        backgroundAlpha: 0, // transparent overlay
        antialias: false,
      });

      initialized = true;

      if (cancelled) {
        safeDestroy();
        return;
      }

      host.appendChild(app.canvas);

      // Load a PNG from Vite public/
      const texture = await Assets.load("/assets/pets/test.png"); // :contentReference[oaicite:3]{index=3}

      if (cancelled) {
        safeDestroy();
        return;
      }

      const pet = new Sprite(texture);

      // Center-bottom-ish anchor so it “stands” on the overlay
      pet.anchor.set(0.5, 1);

      // Scale up cleanly (integer scaling is your friend for pixel art)
      pet.scale.set(4);

      // Position relative to current renderer size
      pet.x = Math.floor(app.renderer.width / 2);
      pet.y = Math.floor(app.renderer.height - 10);

      app.stage.addChild(pet);

      // Tiny “breathing” bob to prove animation loop is working
      const baseY = pet.y;
      app.ticker.add(() => {
        pet.y = baseY + Math.round(Math.sin(performance.now() / 350) * 1);
      });
    })();

    return () => {
      cancelled = true;
      safeDestroy();
    };
  }, []);

  return <div ref={hostRef} style={{ width: "100%", height: "100%" }} />;
}
