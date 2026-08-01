let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
}

export async function prepareTimerAlarmSound() {
  const context = getAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }
}

function playTone(
  context: AudioContext,
  startTime: number,
  frequency: number,
  duration: number
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export async function playTimerAlarmSound() {
  const context = getAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }

  const now = context.currentTime;

  playTone(context, now, 880, 0.18);
  playTone(context, now + 0.24, 1046.5, 0.18);
  playTone(context, now + 0.48, 880, 0.24);
}