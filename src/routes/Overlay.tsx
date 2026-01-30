import PixiStage from "../ui/PixiStage";

export default function Overlay() {
  console.log("Overlay route rendered");

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "rgba(255, 0, 0, 0.25)",
      }}
    >
      <PixiStage />
    </div>
  );
}
