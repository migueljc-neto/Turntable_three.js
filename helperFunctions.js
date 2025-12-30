import * as Audio from "./audio.js";

export function volumeSwitch(value) {
  switch (value) {
    case 0.4:
      Audio.audio1.volume = 1;
      console.log("vol:", Audio.audio1.volume);
      break;

    case 0.3:
      Audio.audio1.volume = 0.875;
      console.log("vol:", Audio.audio1.volume);
      break;

    case 0.2:
      Audio.audio1.volume = 0.75;
      console.log("vol:", Audio.audio1.volume);
      break;

    case 0.1:
      Audio.audio1.volume = 0.625;
      console.log("vol:", Audio.audio1.volume);
      break;

    case 0:
      Audio.audio1.volume = 0.5;
      console.log("vol:", Audio.audio1.volume);
      break;

    case -0.1:
      Audio.audio1.volume = 0.375;
      console.log("vol:", Audio.audio1.volume);
      break;

    case -0.2:
      Audio.audio1.volume = 0.25;
      console.log("vol:", Audio.audio1.volume);
      break;

    case -0.3:
      Audio.audio1.volume = 0.125;
      console.log("vol:", Audio.audio1.volume);
      break;

    case -0.4:
      Audio.audio1.volume = 0;
      console.log("vol:", Audio.audio1.volume);
      break;
  }
}
