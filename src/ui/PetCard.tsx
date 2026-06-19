type PetCardProps = {
    name: string;
    isSelected: boolean;
    onSelect: () => void;
};

export default function PetCard({ 
    name,
    isSelected,
    onSelect,
 }: PetCardProps) {
    return (
        <button
            className={`pet-card ${isSelected ? "pet-card-selected" : ""}`}
            onClick={onSelect}
        >
            <p className="pet-card-name">{name}</p>

            <div className="pet-card-box">
                Sprite Placeholder
            </div>
        </button>
    );
}