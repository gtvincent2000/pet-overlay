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
  ],
  Cat: [
    "Meow. Timer's done.",
    "Your timer is finished. Obviously.",
    "Time's up. I noticed.",
  ],
  Fox: [
    "Yip! Time's up!",
    "Timer complete!",
    "Hey! Your timer's done!",
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