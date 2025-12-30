import * as Audio from "./audio.js";
import { setVinylSpeed } from "./main.js";

export function volumeSwitch(value) {
  switch (value) {
    case 0.4:
      Audio.audio1.volume = 1;
      break;

    case 0.3:
      Audio.audio1.volume = 0.875;
      break;

    case 0.2:
      Audio.audio1.volume = 0.75;
      break;

    case 0.1:
      Audio.audio1.volume = 0.625;
      break;

    case 0:
      Audio.audio1.volume = 0.5;
      break;

    case -0.1:
      Audio.audio1.volume = 0.375;
      break;

    case -0.2:
      Audio.audio1.volume = 0.25;
      break;

    case -0.3:
      Audio.audio1.volume = 0.125;
      break;

    case -0.4:
      Audio.audio1.volume = 0;
      break;
  }
}

export function rateSwitch(value) {
  let speed;
  switch (value) {
    case 0.4:
      Audio.audio1.playbackRate = 1.8; //0.1
      speed = 0.1;
      break;

    case 0.3:
      Audio.audio1.playbackRate = 1.6; //0.0875
      speed = 0.0875;
      break;

    case 0.2:
      Audio.audio1.playbackRate = 1.4; //0.0750
      speed = 0.075;
      break;

    case 0.1:
      Audio.audio1.playbackRate = 1.2; //0.0625
      speed = 0.0625;
      break;

    case 0:
      Audio.audio1.playbackRate = 1; //0.05
      speed = 0.05;
      break;

    case -0.1:
      Audio.audio1.playbackRate = 0.8; //0.0375
      speed = 0.0375;
      break;

    case -0.2:
      Audio.audio1.playbackRate = 0.6; //0.0250
      speed = 0.025;
      break;

    case -0.3:
      Audio.audio1.playbackRate = 0.4; //0.0125
      speed = 0.0125;
      break;

    case -0.4:
      Audio.audio1.playbackRate = 0.2; //0.001
      speed = 0.001;
      break;
  }

  setVinylSpeed(speed);
}

export function nobHandler(value, objName) {
  if (objName == "vNob") {
    volumeSwitch(value);
  } else {
    rateSwitch(value);
  }
}
