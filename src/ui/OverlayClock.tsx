type OverlayClockProps = {
  currentDate: Date;
};

function getCurrentTimeText(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function OverlayClock({ currentDate }: OverlayClockProps) {
  return <>{getCurrentTimeText(currentDate)}</>;
}