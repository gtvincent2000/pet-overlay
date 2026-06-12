type PixelButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
};

export default function PixelButton({
    children,
    onClick,
    className = "",
}: PixelButtonProps) {
    return (
        <button className={`pixel-button ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}