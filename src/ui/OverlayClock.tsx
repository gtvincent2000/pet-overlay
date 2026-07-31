import { useEffect, useState } from "react";

function getCurrentTimeText() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

export default function OverlayClock() {
  const [timeText, setTimeText] = useState(getCurrentTimeText);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeText(getCurrentTimeText());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return <div className="overlay-clock">{timeText}</div>;
}