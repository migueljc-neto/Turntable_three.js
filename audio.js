const playButton = document.getElementById("buttonPlay");
const pauseButton = document.getElementById("buttonPause");
const timeButton = document.getElementById("buttonTime");
const resetButton = document.getElementById("buttonReset");

export let audio1 = new Audio(
  "./src/Injury Reserve - Jailbreak the Tesla (Feat. Aminé).mp3"
);

playButton.addEventListener("click", playAudio);
pauseButton.addEventListener("click", pauseAudio);
timeButton.addEventListener("click", getTime);
resetButton.addEventListener("click", resetTime);

function playAudio() {
  console.log("play audio");
  audio1.play();
}
function pauseAudio() {
  console.log("pause audio");
  audio1.pause();
}
function getTime() {
  console.log("get time");
  console.log(audio1.currentTime);
}

function resetTime() {
  audio1.pause();
  audio1.currentTime = 0;
  console.log(audio1.currentTime);
}
