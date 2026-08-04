import type { PetName } from "./pets";

const genericTimerMessages = [
  "Hey! Your timer's going off!",
  "Time's up!",
  "Timer done!",
  "You did it!",
  "Break time?",
  "Don't forget this!",
];

const petTimerMessages: Record<PetName, string[]> = {
  Dog: [
    "Woof! Time's up!",
    "Hey! Your timer's done!",
    "Timer's done! Good job!",
    "Treat time?",
  ],
  Cat: [
    "Meowdy. Timer's done.",
    "Your timer is finished. Obviously.",
    "Time's up. I noticed.",
    "Timer's done. You're welcome.",
  ],
};

function getRandomItem(items: string[]) {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export function getTimerCompletionMessage(petName: PetName) {
  const messages = [
    ...genericTimerMessages,
    ...petTimerMessages[petName],
  ];

  return getRandomItem(messages);
}