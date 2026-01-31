import { useEffect, useRef } from "react";
import {
  Application,
  Assets,
  AnimatedSprite,
  Texture,
  TextureStyle,
} from "pixi.js";

TextureStyle.defaultOptions.scaleMode = "nearest";

type AtlasLike = {
  textures: Record<string, Texture>;
};

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
        backgroundAlpha: 0,
        antialias: false,
      });

      initialized = true;

      if (cancelled) {
        safeDestroy();
        return;
      }

      host.appendChild(app.canvas);

      const sheet = (await Assets.load(
        "/assets/pets/Milbie_v2.json"
      )) as AtlasLike;

      if (cancelled) {
        safeDestroy();
        return;
      }

      const frames = Object.values(sheet.textures); // now Texture[]

      const pet = new AnimatedSprite(frames);
      pet.anchor.set(0.5, 1);
      pet.scale.set(4);

      pet.x = Math.floor(app.renderer.width / 2);
      pet.y = Math.floor(app.renderer.height - 10);

      pet.animationSpeed = 0.12;
      pet.play();

      app.stage.addChild(pet);
    })();

    return () => {
      cancelled = true;
      safeDestroy();
    };
  }, []);

  return <div ref={hostRef} style={{ width: "100%", height: "100%" }} />;
}
