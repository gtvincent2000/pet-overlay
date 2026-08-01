import { useState } from "react";
import type { PetDefinition } from "../data/pets";
import PetPreview from "./PetPreview";

type PetCardProps = {
  petDefinition: PetDefinition;
  isSelected: boolean;
  onSelect: () => void;
};

export default function PetCard({
  petDefinition,
  isSelected,
  onSelect,
}: PetCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isPreviewActive = isHovered || isSelected;

  return (
    <button
      className={`pet-card ${isSelected ? "pet-card-selected" : ""}`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="pet-card-name">{petDefinition.displayName}</p>

      <div className="pet-card-box">
        {isSelected && (
          <span className="pet-card-checkmark" aria-label="Selected pet">
            ✓
          </span>
        )}

        <PetPreview
          petDefinition={petDefinition}
          isActive={isHovered || isSelected}
        />
      </div>
    </button>
  );
}