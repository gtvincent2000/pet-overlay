import { useEffect, useRef } from "react";
import {
  Application,
  Assets,
  AnimatedSprite,
  Texture,
} from "pixi.js";
import type {
  PetAnimationName,
  PetDefinition,
} from "../data/pets";

type PetPreviewProps = {
  petDefinition: PetDefinition;
  isActive: boolean;
};

type AtlasLike = {
  textures: Record<string, Texture>;
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

function getRequiredClip(
  clips: AnimationClips,
  animationName: PetAnimationName
): Texture[] {
  const clip = clips[animationName];

  if (!clip || clip.length === 0) {
    throw new Error(`Missing preview animation clip: ${animationName}`);
  }

  return clip;
}

export default function PetPreview({
  petDefinition,
  isActive,
}: PetPreviewProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const spriteRef = useRef<AnimatedSprite | null>(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;

    const sprite = spriteRef.current;

    if (!sprite) {
      return;
    }

    if (isActive) {
      sprite.play();
    } else {
      sprite.gotoAndStop(0);
    }
  }, [isActive]);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const app = new Application();
    let cancelled = false;
    let initialized = false;

    const destroyApp = () => {
      if (!initialized) {
        return;
      }

      try {
        if (app.canvas?.parentElement) {
          app.canvas.parentElement.removeChild(app.canvas);
        }

        app.destroy(true);
      } catch (error) {
        console.warn("PetPreview destroy warning:", error);
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
        destroyApp();
        return;
      }

      host.appendChild(app.canvas);
      appRef.current = app;

      const sheet = (await Assets.load(
        petDefinition.spriteSheetPath
      )) as AtlasLike;

      if (cancelled) {
        return;
      }

      const clips = buildAnimationClips(sheet, petDefinition);
      const previewFrames = getRequiredClip(
        clips,
        petDefinition.previewAnimation
      );

      const previewAnimation = petDefinition.animations.find(
        (animation) => animation.name === petDefinition.previewAnimation
      );

      const sprite = new AnimatedSprite(previewFrames);

      sprite.anchor.set(0.5, 1);
      sprite.scale.set(petDefinition.selectionPreviewScale);
      sprite.animationSpeed = previewAnimation?.frameRate ?? 0.12;
      sprite.loop = previewAnimation?.loop ?? true;
      sprite.tint = petDefinition.placeholderTint;

      sprite.x = Math.floor(app.renderer.width / 2);
      sprite.y =
        Math.floor(app.renderer.height - 6) +
        petDefinition.selectionPreviewYOffset;

      app.stage.addChild(sprite);
      spriteRef.current = sprite;

      if (isActiveRef.current) {
        sprite.play();
      } else {
        sprite.gotoAndStop(0);
      }
    })().catch((error) => {
      console.error(
        `Failed to load pet preview for ${petDefinition.name}:`,
        error
      );
    });

    return () => {
      cancelled = true;
      spriteRef.current = null;
      appRef.current = null;
      destroyApp();
    };
  }, [petDefinition]);

  return <div className="pet-preview" ref={hostRef} />;
}