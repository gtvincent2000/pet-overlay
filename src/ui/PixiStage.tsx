import { useEffect, useRef } from "react";

import { 
  getPetDefinition,
  type PetAnimationName,
  type PetDefinition,
  type PetName,
} from "../data/pets";

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

type PixiStageProps = {
  selectedPet: PetName;
};

type AnimationClips = Partial<Record<PetAnimationName, Texture[]>>;

function getSortedFrames(sheet: AtlasLike): Texture[] {
  return Object.entries(sheet.textures)
    .sort(([a], [b]) => {
      const na = Number(a.match(/(\d+)\.aseprite$/)?.[1] ?? 0);
      const nb = Number(b.match(/(\d+)\.aseprite$/)?.[1] ?? 0);
      return na - nb;
    })
    .map(([, tex]) => tex);
}

function buildAnimationClips(
  sheet: AtlasLike,
  petDefinition: PetDefinition
): AnimationClips {
  const frames = getSortedFrames(sheet);
  const clips: AnimationClips = {};

  for (const animation of petDefinition.animations) {
    const startIndex = animation.startFrame - 1;
    const endIndexExclusive = animation.endFrame;

    clips[animation.name] = frames.slice(startIndex, endIndexExclusive);
  }

  return clips;
}

function getAnimationDefinition(
  petDefinition: PetDefinition,
  animationName: PetAnimationName
) {
  return petDefinition.animations.find(
    (animation) => animation.name === animationName
  );
}

function getRequiredClip(
  clips: AnimationClips,
  animationName: PetAnimationName
): Texture[] {
  const clip = clips[animationName];

  if (!clip || clip.length === 0) {
    throw new Error(`Missing animation clip: ${animationName}`);
  }

  return clip;
}

function getOptionalClip(
  clips: AnimationClips,
  animationName: PetAnimationName
): Texture[] | undefined {
  const clip = clips[animationName];

  if (!clip || clip.length === 0) {
    return undefined;
  }

  return clip;
}

export default function PixiStage({ selectedPet }: PixiStageProps) {

  const hostRef = useRef<HTMLDivElement | null>(null);
  
  const petSpriteRef = useRef<AnimatedSprite | null>(null);
  const selectedPetRef = useRef(selectedPet);

  useEffect(() => {
    selectedPetRef.current = selectedPet;

    const petDefinition = getPetDefinition(selectedPet);

    if (petSpriteRef.current) {
      petSpriteRef.current.tint = petDefinition.placeholderTint;
    }
  }, [selectedPet]);

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

      const initialPetDefinition = getPetDefinition(selectedPetRef.current);

      const sheet = (await Assets.load(
        initialPetDefinition.spriteSheetPath
      )) as AtlasLike;

      if (cancelled) {
        safeDestroy();
        return;
      }

      const clips = buildAnimationClips(sheet, initialPetDefinition);

      const defaultAnimationName = initialPetDefinition.defaultOverlayAnimation;
      const defaultFrames = getRequiredClip(clips, defaultAnimationName);

      const pet = new AnimatedSprite(defaultFrames);

      const petDefinition = getPetDefinition(selectedPetRef.current);

      petSpriteRef.current = pet;
      pet.tint = petDefinition.placeholderTint;
      

      const playClip = (
        textures: Texture[],
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
        textures: Texture[],
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

      const playLoopForMs = (
        textures: Texture[],
        { speed = 0.12, ms = 1200 }: { speed?: number; ms?: number },
        onDone?: () => void
      ) => {
        playClip(textures, { speed, loop: true });
        window.setTimeout(() => {
          onDone?.();
        }, ms);
      };

      pet.anchor.set(0.5, 1);
      pet.scale.set(4);

      pet.x = Math.floor(app.renderer.width / 2);
      pet.y = Math.floor(app.renderer.height - 10);

      const defaultAnimation = getAnimationDefinition(
        initialPetDefinition,
        defaultAnimationName
      );

      playClip(defaultFrames, {
        speed: defaultAnimation?.frameRate ?? 0.12,
        loop: defaultAnimation?.loop ?? true,
      });
      
      const idleClip = getRequiredClip(clips, "idle");
      const tongueExtendClip = getOptionalClip(clips, "tongueExtend");
      const tongueOutIdleClip = getOptionalClip(clips, "tongueOutIdle");
      const tongueRetractClip = getOptionalClip(clips, "tongueRetract");

      const idleAnimation = getAnimationDefinition(initialPetDefinition, "idle");
      const tongueExtendAnimation = getAnimationDefinition(
        initialPetDefinition,
        "tongueExtend"
      );
      const tongueOutIdleAnimation = getAnimationDefinition(
        initialPetDefinition,
        "tongueOutIdle"
      );
      const tongueRetractAnimation = getAnimationDefinition(
        initialPetDefinition,
        "tongueRetract"
      );

      if (tongueExtendClip && tongueOutIdleClip && tongueRetractClip) {
      let isBlepRunning = false;

      intervalId = window.setInterval(() => {
        if (isBlepRunning) return;

        isBlepRunning = true;

        playOnce(
          tongueExtendClip,
          {
            speed: tongueExtendAnimation?.frameRate ?? 0.14,
          },
          () => {
            playLoopForMs(
              tongueOutIdleClip,
              {
                speed: tongueOutIdleAnimation?.frameRate ?? 0.14,
                ms: 1600,
              },
              () => {
                playOnce(
                  tongueRetractClip,
                  {
                    speed: tongueRetractAnimation?.frameRate ?? 0.14,
                  },
                  () => {
                    playClip(idleClip, {
                      speed: idleAnimation?.frameRate ?? 0.12,
                      loop: idleAnimation?.loop ?? true,
                    });

                    isBlepRunning = false;
                  }
                );
              }
            );
          }
        );
      }, 8000);
    }


      app.stage.addChild(pet);
    })();

    return () => {
      cancelled = true;
      petSpriteRef.current = null;
      safeDestroy();
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  return <div ref={hostRef} style={{ width: "100%", height: "100%" }} />;
}
