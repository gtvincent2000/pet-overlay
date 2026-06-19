import BackButton from "../ui/BackButton";
import PetCard from "../ui/PetCard";
import { pets, type PetName } from "../data/pets";

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
    <div className="screen-page">
      <div className="pet-selection-page">
        <BackButton onClick={onBack}>←Back</BackButton>
        <h1>Pets</h1>

        <div className="pet-grid">
          {pets.map((pet) => (
            <PetCard
              key={pet}
              name={pet}
              isSelected={selectedPet === pet}
              onSelect={() => onSelectPet(pet)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}