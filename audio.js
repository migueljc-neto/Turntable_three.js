import * as main from "./main.js";

let currSource = "./src/tracks/IR -JTT.mp3";
let tracks = [
  "./src/tracks/IR -JTT.mp3",
  "./src/tracks/BS -WP.mp3",
  "./src/tracks/YL -A.mp3",
];

export let audio1 = new Audio(currSource);

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
  console.log(audio1.isPlaying);
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
