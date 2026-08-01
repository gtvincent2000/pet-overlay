export type DayPhaseId =
  | "earlyMorning"
  | "morning"
  | "lateMorning"
  | "midday"
  | "afternoon"
  | "evening"
  | "night";

export type DayPhase = {
  id: DayPhaseId;
  containerImagePath: string;
};

const dayPhases: DayPhase[] = [
  {
    id: "earlyMorning",
    containerImagePath: "/assets/ui/timer-containers/Timer_container_1.png",
  },
  {
    id: "morning",
    containerImagePath: "/assets/ui/timer-containers/Timer_container_2.png",
  },
  {
    id: "lateMorning",
    containerImagePath: "/assets/ui/timer-containers/Timer_container_3.png",
  },
  {
    id: "midday",
    containerImagePath: "/assets/ui/timer-containers/Timer_container_4.png",
  },
  {
    id: "afternoon",
    containerImagePath: "/assets/ui/timer-containers/Timer_container_5.png",
  },
  {
    id: "evening",
    containerImagePath: "/assets/ui/timer-containers/Timer_container_6.png",
  },
  {
    id: "night",
    containerImagePath: "/assets/ui/timer-containers/Timer_container_7.png",
  },
];

export function getDayPhaseForDate(date: Date): DayPhase {
  const hour = date.getHours();

  if (hour >= 5 && hour < 8) {
    return dayPhases[0];
  }

  if (hour >= 8 && hour < 10) {
    return dayPhases[1];
  }

  if (hour >= 10 && hour < 12) {
    return dayPhases[2];
  }

  if (hour >= 12 && hour < 14) {
    return dayPhases[3];
  }

  if (hour >= 14 && hour < 17) {
    return dayPhases[4];
  }

  if (hour >= 17 && hour < 20) {
    return dayPhases[5];
  }

  return dayPhases[6];
}