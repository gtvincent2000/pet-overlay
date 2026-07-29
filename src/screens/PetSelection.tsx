import BackButton from "../ui/BackButton";
import PetCard from "../ui/PetCard";
import { petDefinitions, type PetName } from "../data/pets";

type PetSelectionProps = {
  onBack: () => void;
  selectedPet: PetName;
  onSelectPet: (pet: PetName) => void;
};

export default function PetSelection({ 
  onBack,
  selectedPet,
  onSelectPet,
 }: PetSelectionProps) {

  return (
    <div className="screen-page pet-selection-page">
      <BackButton onClick={onBack}>←Back</BackButton>
      <h1>Pets</h1>
        <div className="pet-grid">
          {petDefinitions.map((pet) => (
            <PetCard
              key={pet.name}
              petDefinition={pet}
              isSelected={selectedPet === pet.name}
              onSelect={() => onSelectPet(pet.name)}
            />
          ))}
        </div>
    </div>
  );
}