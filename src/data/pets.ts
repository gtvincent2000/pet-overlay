export type PetName = "Dog" | "Cat" | "Fox";

export type PetAnimationName =
  | "idle"
  | "blep"
  | "sleep"
  | "play";

export type PetAnimationDefinition = {
  name: PetAnimationName;
  framePrefix: string;
  frameCount: number;
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
        framePrefix: "wagTongueIn",
        frameCount: 6,
        frameRate: 0.12,
        loop: true,
      },
      {
        name: "blep",
        framePrefix: "tongueOut",
        frameCount: 6,
        frameRate: 0.16,
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
        framePrefix: "wagTongueIn",
        frameCount: 6,
        frameRate: 0.12,
        loop: true,
      },
      {
        name: "blep",
        framePrefix: "tongueOut",
        frameCount: 6,
        frameRate: 0.16,
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
        framePrefix: "wagTongueIn",
        frameCount: 6,
        frameRate: 0.12,
        loop: true,
      },
      {
        name: "blep",
        framePrefix: "tongueOut",
        frameCount: 6,
        frameRate: 0.16,
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