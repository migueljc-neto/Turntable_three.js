let source;

export let audio1 = new Audio(
  "./src/Injury Reserve - Jailbreak the Tesla (Feat. Aminé).mp3"
);

export let backwardScratch = new Audio("./src/scratch.mp3");
export let forwardScratch = new Audio("./src/scratch.mp3");

export function playScratch(direction) {
  if (forwardScratch.isPlaying) forwardScratch.pause();
  if (backwardScratch.isPlaying) backwardScratch.pause();

  if (direction === "forward") {
    forwardScratch.play();
  } else {
    backwardScratch.play();
  }
}

export function stopScratch() {
  if (!forwardScratch.paused) {
    forwardScratch.pause();
    forwardScratch.currentTime = 0;
  }
  if (!backwardScratch.paused) {
    backwardScratch.pause();
    backwardScratch.currentTime = 0;
  }
}

export function playAudio() {
  console.log("play audio");
  audio1.play();
}
export function pauseAudio() {
  console.log("pause audio");
  audio1.pause();
}
export function getTime() {
  return audio1.currentTime;
}

export function setTime(stamp) {
  audio1.currentTime = stamp;
}
export function resetTime() {
  audio1.currentTime = 0;
}
