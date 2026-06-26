export type PetName = "Dog" | "Cat" | "Fox";

export type PetDefinition = {
  name: PetName;
  displayName: string;
  spriteSheetPath: string;
  placeholderTint: number;
};

export const petDefinitions: PetDefinition[] = [
  {
    name: "Dog",
    displayName: "Dog",
    spriteSheetPath: "/assets/pets/Milbie_v2.json",
    placeholderTint: 0xffffff,
  },
  {
    name: "Cat",
    displayName: "Cat",
    spriteSheetPath: "/assets/pets/Milbie_v2.json",
    placeholderTint: 0xffc36b,
  },
  {
    name: "Fox",
    displayName: "Fox",
    spriteSheetPath: "/assets/pets/Milbie_v2.json",
    placeholderTint: 0xff8c42,
  },
];

export const pets: PetName[] = petDefinitions.map((pet) => pet.name);

export function isPetName(value: string | null): value is PetName {
  return pets.includes(value as PetName);
}

export function getPetDefinition(name: PetName): PetDefinition {
  return petDefinitions.find((pet) => pet.name === name) ?? petDefinitions[0];
}