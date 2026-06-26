export type PetName = "Dog" | "Cat" | "Fox";

export type PetAnimationName =
  | "idle"
  | "tongueExtend"
  | "tongueOutIdle"
  | "tongueRetract"
  | "sleep"
  | "play";

export type PetAnimationDefinition = {
  name: PetAnimationName;

  // 1-based Aseprite frame numbers
  startFrame: number;
  endFrame: number;

  frameRate: number;
  loop: boolean;
};

export type PetDefinition = {
  name: PetName;
  displayName: string;
  spriteSheetPath: string;
  placeholderTint: number;
  
  previewAnimation: PetAnimationName;
  defaultOverlayAnimation: PetAnimationName;
  animations: PetAnimationDefinition[];
};

export const petDefinitions: PetDefinition[] = [
  {
    name: "Dog",
    displayName: "Dog",
    spriteSheetPath: "/assets/pets/Milbie_v2.json",
    placeholderTint: 0xffffff,
    previewAnimation: "idle",
    defaultOverlayAnimation: "idle",
    animations: [
      {
        name: "idle",
        startFrame: 13,
        endFrame: 42,
        frameRate: 0.12,
        loop: true,
      },
      {
        name: "tongueExtend",
        startFrame: 43,
        endFrame: 48,
        frameRate: 0.14,
        loop: false,
      },
      {
        name: "tongueOutIdle",
        startFrame: 49,
        endFrame: 54,
        frameRate: 0.14,
        loop: true,
      },
      {
        name: "tongueRetract",
        startFrame: 7,
        endFrame: 12,
        frameRate: 0.14,
        loop: false,
      },
    ],
  },
  {
    name: "Cat",
    displayName: "Cat",
    spriteSheetPath: "/assets/pets/Milbie_v2.json",
    placeholderTint: 0xffc36b,
    previewAnimation: "idle",
    defaultOverlayAnimation: "idle",
    animations: [
      {
        name: "idle",
        startFrame: 13,
        endFrame: 42,
        frameRate: 0.12,
        loop: true,
      },
      {
        name: "tongueExtend",
        startFrame: 43,
        endFrame: 48,
        frameRate: 0.14,
        loop: false,
      },
      {
        name: "tongueOutIdle",
        startFrame: 49,
        endFrame: 54,
        frameRate: 0.14,
        loop: true,
      },
      {
        name: "tongueRetract",
        startFrame: 7,
        endFrame: 12,
        frameRate: 0.14,
        loop: false,
      },
    ],
  },
  {
    name: "Fox",
    displayName: "Fox",
    spriteSheetPath: "/assets/pets/Milbie_v2.json",
    placeholderTint: 0xff8c42,
    previewAnimation: "idle",
    defaultOverlayAnimation: "idle",
    animations: [
      {
        name: "idle",
        startFrame: 13,
        endFrame: 42,
        frameRate: 0.12,
        loop: true,
      },
      {
        name: "tongueExtend",
        startFrame: 43,
        endFrame: 48,
        frameRate: 0.14,
        loop: false,
      },
      {
        name: "tongueOutIdle",
        startFrame: 49,
        endFrame: 54,
        frameRate: 0.14,
        loop: true,
      },
      {
        name: "tongueRetract",
        startFrame: 7,
        endFrame: 12,
        frameRate: 0.14,
        loop: false,
      },
    ],
  },
];

export const pets: PetName[] = petDefinitions.map((pet) => pet.name);

export function isPetName(value: string | null): value is PetName {
  return pets.includes(value as PetName);
}

export function getPetDefinition(name: PetName): PetDefinition {
  return petDefinitions.find((pet) => pet.name === name) ?? petDefinitions[0];
}