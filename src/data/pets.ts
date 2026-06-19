export type PetName = "Dog" | "Cat" | "Fox";

export const pets: PetName[] = ["Dog", "Cat", "Fox"];

export function isPetName(value: string | null): value is PetName {
    return value === "Dog" || value === "Cat" || value === "Fox";
}