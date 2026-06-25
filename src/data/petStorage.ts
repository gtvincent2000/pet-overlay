import { isPetName, type PetName } from "./pets";

const SELECTED_PET_STORAGE_KEY = "selectedPet";

export function getStoredSelectedPet(): PetName {
    const savedPet = localStorage.getItem(SELECTED_PET_STORAGE_KEY);

    if (isPetName(savedPet)) {
        return savedPet;
    }

    return "Dog";
}

export function saveSelectedPet(pet: PetName) {
    localStorage.setItem(SELECTED_PET_STORAGE_KEY, pet);
}