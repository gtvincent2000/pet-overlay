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

    let intervalId: number | undefined;

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

      const frames = Object.entries(sheet.textures)
      .sort(([a], [b]) => {
        const na = Number(a.match(/(\d+)\.aseprite$/)?.[1] ?? 0);
        const nb = Number(b.match(/(\d+)\.aseprite$/)?.[1] ?? 0);
        return na - nb;
      })
      .map(([, tex]) => tex);

      // Helper: inclusive range slice
      const clip = (start: number, endInclusive: number) =>
        frames.slice(start, endInclusive + 1);

      // Clips (Aseprite frames 1–54 => indices 0–53)
      const clips = {
        wagTongueOutA: clip(0, 5),      // frames 1–6
        tongueRetract: clip(6, 11),     // frames 7–12
        wagTongueIn: clip(12, 41),      // frames 13–42
        tongueExtend: clip(42, 47),     // frames 43–48
        wagTongueOutB: clip(48, 53),    // frames 49–54
      };

      const pet = new AnimatedSprite(clips.wagTongueIn);

      const playClip = (
        textures: typeof clips[keyof typeof clips],
        {
          speed = 0.12,
          loop = true,
          startFrame = 0,
        }: { speed?: number; loop?: boolean; startFrame?: number } = {}
      ) => {
        pet.textures = textures;
        pet.animationSpeed = speed;
        pet.loop = loop;
        pet.gotoAndPlay(startFrame);
      };

      const playOnce = (
        textures: typeof clips[keyof typeof clips],
        { speed = 0.12, startFrame = 0 }: { speed?: number; startFrame?: number } = {},
        onDone?: () => void
      ) => {
        pet.textures = textures;
        pet.animationSpeed = speed;
        pet.loop = false;

        // Clear any previous callback to avoid accidental chaining
        pet.onComplete = undefined;

        pet.onComplete = () => {
          pet.onComplete = undefined;
          onDone?.();
        };

        pet.gotoAndPlay(startFrame);
      };


      pet.anchor.set(0.5, 1);
      pet.scale.set(4);

      pet.x = Math.floor(app.renderer.width / 2);
      pet.y = Math.floor(app.renderer.height - 10);

      pet.animationSpeed = 0.12;
      playClip(clips.wagTongueIn, { speed: 0.12, loop: true });

      intervalId = window.setInterval(() => {
        // tongue goes out, then return to normal idle
        playOnce(clips.tongueExtend, { speed: 0.14 }, () => {
          playClip(clips.wagTongueIn, { speed: 0.12, loop: true });
        });
      }, 8000);


      app.stage.addChild(pet);
    })();

    return () => {
      cancelled = true;
      safeDestroy();
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  return <div ref={hostRef} style={{ width: "100%", height: "100%" }} />;
}
