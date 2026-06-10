type PixelPanelProps = {
    children: React.ReactNode;
    className?: string;
};

export default function PixelPanel({
    children,
    className = "",
}: PixelPanelProps) {
    return (
        <section className={`pixel-panel ${className}`}>
            {children}
        </section>
    );
}