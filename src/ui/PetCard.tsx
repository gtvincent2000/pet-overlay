type PetCardProps = {
    name: string;
};

export default function PetCard({ name }: PetCardProps) {
    return (
        <div className="pet-card">
            <p className="pet-card-names">{name}</p>

            <div className="pet-card-box">
                Sprite Placeholder
            </div>
        </div>
    );
}