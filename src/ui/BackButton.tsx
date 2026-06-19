type BackButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
};

export default function BackButton({
    children,
    onClick,
    className = "",
}: BackButtonProps) {
    return (
        <button className={`back-button ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}