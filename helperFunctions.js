import * as Audio from "./audio.js";

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
  switch (value) {
    case 0.4:
      Audio.audio1.playbackRate = 1.8;
      break;

    case 0.3:
      Audio.audio1.playbackRate = 1.6;
      break;

    case 0.2:
      Audio.audio1.playbackRate = 1.4;
      break;

    case 0.1:
      Audio.audio1.playbackRate = 1.2;
      break;

    case 0:
      Audio.audio1.playbackRate = 1;
      break;

    case -0.1:
      Audio.audio1.playbackRate = 0.8;
      break;

    case -0.2:
      Audio.audio1.playbackRate = 0.6;
      break;

    case -0.3:
      Audio.audio1.playbackRate = 0.4;
      break;

    case -0.4:
      Audio.audio1.playbackRate = 0.2;
      break;
  }
}

export function nobHandler(value, objName) {
  if (objName == "vNob") {
    volumeSwitch(value);
  } else {
    rateSwitch(value);
  }
}
