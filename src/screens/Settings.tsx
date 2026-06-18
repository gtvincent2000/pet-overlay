import PixelButton from "../ui/PixelButton";

type SettingsProps = {
  onBack: () => void;
};

export default function Settings ({ onBack }: SettingsProps) {
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <p>Settings screen coming soon.</p>
      <PixelButton onClick={onBack}>Back</PixelButton>
    </div>
  )
}