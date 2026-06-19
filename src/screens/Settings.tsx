import BackButton from "../ui/BackButton";

type SettingsProps = {
  onBack: () => void;
};

export default function Settings ({ onBack }: SettingsProps) {
  return (
    <div className="screen-page">
      <div className="settings-page">
        <BackButton onClick={onBack}>←Back</BackButton>
        <h1>Settings</h1>
        <p>Settings screen coming soon.</p>
      </div>
    </div>
  )
}