type MenuButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function MenuButton({
  children,
  onClick,
  className = "",
}: MenuButtonProps) {
  return (
    <button className={`menu-button ${className}`} onClick={onClick}>
      <span className="menu-button-label">{children}</span>
    </button>
  );
}