import { useEffect, useRef, useState } from "react";

import { 
  DEFAULT_PET_NAME,
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

function getFrameNumberFromTextureName(textureName: string) {
  const match = textureName.match(/(\d+)(?=\D*$)/);

  if (!match) {
    return undefined;
  }

  return Number(match[1]);
}

function getSortedFrames(sheet: AtlasLike): Texture[] {
  return Object.entries(sheet.textures)
    .map(([name, texture], index) => ({
      name,
      texture,
      index,
      frameNumber: getFrameNumberFromTextureName(name),
    }))
    .sort((a, b) => {
      const aSortValue = a.frameNumber ?? a.index;
      const bSortValue = b.frameNumber ?? b.index;

      return aSortValue - bSortValue;
    })
    .map((entry) => entry.texture);
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

type LoadedPetResources = {
  petDefinition: PetDefinition;
  sheet: AtlasLike;
  clips: AnimationClips;
  defaultAnimationName: PetAnimationName;
  defaultFrames: Texture[];
};

async function loadPetResources(
  petDefinition: PetDefinition
): Promise<LoadedPetResources> {
  const sheet = (await Assets.load(
    petDefinition.spriteSheetPath
  )) as AtlasLike;

  const clips = buildAnimationClips(sheet, petDefinition);

  const defaultAnimationName = petDefinition.defaultOverlayAnimation;
  const defaultFrames = getRequiredClip(clips, defaultAnimationName);

  return {
    petDefinition,
    sheet,
    clips,
    defaultAnimationName,
    defaultFrames,
  };
}

async function loadPetResourcesWithFallback(
  selectedPet: PetName
): Promise<LoadedPetResources> {
  const selectedPetDefinition = getPetDefinition(selectedPet);

  try {
    return await loadPetResources(selectedPetDefinition);
  } catch (error) {
    console.warn(
      `Failed to load assets for ${selectedPetDefinition.name}. Falling back to ${DEFAULT_PET_NAME}.`,
      error
    );

    if (selectedPet === DEFAULT_PET_NAME) {
      throw error;
    }

    const fallbackPetDefinition = getPetDefinition(DEFAULT_PET_NAME);

    return await loadPetResources(fallbackPetDefinition);
  }
}

export default function PixiStage({ selectedPet }: PixiStageProps) {

  const hostRef = useRef<HTMLDivElement | null>(null);

  const appRef = useRef<Application | null>(null);
  const petSpriteRef = useRef<AnimatedSprite | null>(null);

  const blepIntervalRef = useRef<number | undefined>(undefined);
  const behaviorTimeoutRef = useRef<number | undefined>(undefined);

  const animationRunIdRef = useRef(0);
  const selectedPetRef = useRef(selectedPet);

  const [isPixiReady, setIsPixiReady] = useState(false);

  const clearPetBehaviorTimers = () => {
    if (blepIntervalRef.current !== undefined) {
      window.clearInterval(blepIntervalRef.current);
      blepIntervalRef.current = undefined;
    }

    if (behaviorTimeoutRef.current !== undefined) {
      window.clearTimeout(behaviorTimeoutRef.current);
      behaviorTimeoutRef.current = undefined;
    }

    if (petSpriteRef.current) {
      petSpriteRef.current.onComplete = undefined;
    }
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const app = new Application();
    let cancelled = false;
    let initialized = false;

    const safeDestroy = () => {
      if (!initialized) return;

      try {
        clearPetBehaviorTimers();

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

      appRef.current = app;
      setIsPixiReady(true);
    })();

    return () => {
      cancelled = true;

      animationRunIdRef.current += 1;
      petSpriteRef.current = null;
      appRef.current = null;
      setIsPixiReady(false);

      safeDestroy();
    };
  }, []);

  useEffect(() => {
    selectedPetRef.current = selectedPet;

    const app = appRef.current;

    if (!isPixiReady || !app) {
      return;
    }

    animationRunIdRef.current += 1;
    const runId = animationRunIdRef.current;

    clearPetBehaviorTimers();

    let cancelled = false;

    const isCurrentRun = () => {
      return !cancelled && animationRunIdRef.current === runId;
    };

    (async () => {
      const {
        petDefinition,
        clips,
        defaultAnimationName,
        defaultFrames,
      } = await loadPetResourcesWithFallback(selectedPet);

      if (!isCurrentRun()) return;

      let pet = petSpriteRef.current;

      if (!pet) {
        pet = new AnimatedSprite(defaultFrames);

        pet.anchor.set(0.5, 1);

        app.stage.addChild(pet);
        petSpriteRef.current = pet;
      }

      pet.scale.set(petDefinition.renderScale);

      pet.stop();
      pet.onComplete = undefined;

      pet.textures = defaultFrames;
      pet.tint = petDefinition.placeholderTint;

      pet.x = Math.floor(app.renderer.width / 2);
      pet.y = Math.floor(app.renderer.height - 10);

      const playClip = (
        textures: Texture[],
        {
          speed = 0.12,
          loop = true,
          startFrame = 0,
        }: { speed?: number; loop?: boolean; startFrame?: number } = {}
      ) => {
        if (!isCurrentRun()) return;

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
        if (!isCurrentRun()) return;

        pet.textures = textures;
        pet.animationSpeed = speed;
        pet.loop = false;

        pet.onComplete = undefined;

        pet.onComplete = () => {
          pet.onComplete = undefined;

          if (!isCurrentRun()) return;

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

        behaviorTimeoutRef.current = window.setTimeout(() => {
          behaviorTimeoutRef.current = undefined;

          if (!isCurrentRun()) return;

          onDone?.();
        }, ms);
      };

      const defaultAnimation = getAnimationDefinition(
        petDefinition,
        defaultAnimationName
      );

      playClip(defaultFrames, {
        speed: defaultAnimation?.frameRate ?? 0.12,
        loop: defaultAnimation?.loop ?? true,
      });

      const idleClip = getRequiredClip(clips, "idle");
      const idleAnimation = getAnimationDefinition(petDefinition, "idle");

      const tongueExtendClip = getOptionalClip(clips, "tongueExtend");
      const tongueOutIdleClip = getOptionalClip(clips, "tongueOutIdle");
      const tongueRetractClip = getOptionalClip(clips, "tongueRetract");

      const tongueExtendAnimation = getAnimationDefinition(
        petDefinition,
        "tongueExtend"
      );
      const tongueOutIdleAnimation = getAnimationDefinition(
        petDefinition,
        "tongueOutIdle"
      );
      const tongueRetractAnimation = getAnimationDefinition(
        petDefinition,
        "tongueRetract"
      );

      if (tongueExtendClip && tongueOutIdleClip && tongueRetractClip) {
        let isBlepRunning = false;

        blepIntervalRef.current = window.setInterval(() => {
          if (!isCurrentRun()) return;
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
    })().catch((error) => {
      console.error("Failed to setup selected pet animation:", error);
    });

    return () => {
      cancelled = true;
      clearPetBehaviorTimers();
    };
  }, [selectedPet, isPixiReady]);

  return <div ref={hostRef} style={{ width: "100%", height: "100%" }} />;
}
