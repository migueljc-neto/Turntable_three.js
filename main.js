import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import * as Helper from "./helperFunctions.js";
import * as Audio from "./audio.js";

window.addEventListener("load", () => {
  Audio.audio1.volume = 0.5;
  Audio.audio1.playbackRate = 1;
  setVinylSpeed(0.05);
  console.log(Audio.audio1.paused);
  console.log(0xffff00 - 0xfff610);
});

//SCENE ####################################################################################################
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//HELPER
const textLoader = new THREE.TextureLoader();
/* const axesHelper = new THREE.AxesHelper(5);
const gridHelper = new THREE.GridHelper(5);
scene.add(axesHelper);
scene.add(gridHelper); */

camera.position.set(0, 5.5, 3);
camera.rotation.x = 5.8;

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#000000ff");
document.body.appendChild(renderer.domElement);

//ROOM ####################################################################################################
const roomTexture = textLoader.load(`./src/tile.webp`);

roomTexture.wrapS = THREE.RepeatWrapping;
roomTexture.wrapT = THREE.RepeatWrapping;
roomTexture.repeat.set(3, 3);

const roomGeo = new THREE.BoxGeometry(20, 10, 20);
const roomMat = new THREE.MeshStandardMaterial({
  color: 0x828282,
  map: roomTexture,
  side: THREE.BackSide,
});

const room = new THREE.Mesh(roomGeo, roomMat);
room.receiveShadow = true;
room.position.set(0, 3.6, 0);

scene.add(room);

const mainLightPosition = [
  [-9, 8, -9],
  [9, 8, -9],
  [-9, 8, 9],
  [-9, 8, 9],
];

const lights = [];

for (let i = 0; i < 3; i++) {
  let light = new THREE.PointLight(0xffff00, 30);
  light.position.set(...mainLightPosition[i]);
  light.castShadow = true;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  scene.add(light);
  lights.push(light);
}

function setLightColor(value) {
  lights.forEach((item) => {
    item.color.set(value);
  });
}

const underLightL = new THREE.PointLight(0x7e111a, 10);
underLightL.position.set(0, 0, -5);
underLightL.castShadow = true;

underLightL.shadow.mapSize.width = 1024;
underLightL.shadow.mapSize.height = 1024;

scene.add(underLightL);

const cellLight = new THREE.PointLight(0xffff00, 2);
cellLight.position.set(0, 5, 0);
cellLight.castShadow = true;

cellLight.shadow.mapSize.width = 1024;
cellLight.shadow.mapSize.height = 1024;

scene.add(cellLight);
//Table ####################################################################################################
const tableTexture = textLoader.load(`./src/tableTexture.png`);

const tableGeometry = new THREE.BoxGeometry(8, 4, 4);
const tableMaterial = new THREE.MeshStandardMaterial({
  color: 0x8787a8,
  roughness: 0.7,
  metalness: 0,
  map: tableTexture,
  wireframe: false,
});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, 0.5, 0);

scene.add(table);

//TURNTABLE ####################################################################################################
const turntableTexture = [
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/turntable/turntableBase.png"),
  }),
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/turntable/turntableBase.png"),
  }),
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/turntable/turntable.png"),
  }),
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/turntable/turntableBase.png"),
  }),
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/turntable/turntableBase.png"),
  }),
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/turntable/turntableBase.png"),
  }),
];

const turnTableGeometry = new THREE.BoxGeometry(5, 0.2, 2.5);

const turnTable = new THREE.Mesh(turnTableGeometry, turntableTexture);
turnTable.position.set(0, 2.6, 0);

scene.add(turnTable);

//OnLight ####################################################################################################
const capsuleGeo = new THREE.CapsuleGeometry(0.05, 0.1, 4, 8, 1);
const capsuleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const capsule = new THREE.Mesh(capsuleGeo, capsuleMat);
capsule.position.set(2, 0.1, 0.9);
turnTable.add(capsule);

const tableLight = new THREE.PointLight(0x519733, 0);
tableLight.position.set(2, 0.3, 0.9);
tableLight.castShadow = true;

tableLight.shadow.mapSize.width = 1024;
tableLight.shadow.mapSize.height = 1024;

turnTable.add(tableLight);

//BUTTON ####################################################################################################
const buttonGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);

// PLAY BUTTON
const playButton = new THREE.Mesh(buttonGeo, Helper.buttonMaterials("Play"));
turnTable.add(playButton);
playButton.name = "playB";
playButton.position.set(0.7, 0.1, 0.9);

// PAUSE BUTTON
const pauseButton = new THREE.Mesh(buttonGeo, Helper.buttonMaterials("Pause"));
turnTable.add(pauseButton);
pauseButton.name = "pauseB";
pauseButton.position.set(1.1, 0.1, 0.9);

// RESET BUTTON
const resetButton = new THREE.Mesh(buttonGeo, Helper.buttonMaterials("Reset"));
turnTable.add(resetButton);
resetButton.name = "resetB";
resetButton.position.set(1.5, 0.1, 0.9);

// NEXT BUTTON
const nextButton = new THREE.Mesh(buttonGeo, Helper.buttonMaterials("Next"));
turnTable.add(nextButton);
nextButton.name = "nextB";
nextButton.position.set(1.3, 0.1, 0.5);

// PREV BUTTON
const prevButton = new THREE.Mesh(buttonGeo, Helper.buttonMaterials("Prev"));
turnTable.add(prevButton);
prevButton.name = "prevB";
prevButton.position.set(0.9, 0.1, 0.5);

//SLIDERS ####################################################################################################
const sliderGeo = new THREE.BoxGeometry(0.3, 0.2, 1);
const sliderMat = new THREE.MeshNormalMaterial();

const sliderMaterials = [
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/sliders/right.png"),
  }),
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/sliders/left.png"),
  }),
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/sliders/top.png"),
  }),
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/sliders/bottom.png"),
  }),
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/sliders/front.png"),
  }),
  new THREE.MeshStandardMaterial({
    map: textLoader.load("./src/sliders/back.png"),
  }),
];

const sliders = new THREE.Group();
turnTable.add(sliders);
sliders.position.set(1.4, 0.1, -0.4);

// VOLUME SLIDER
const volumeSlider = new THREE.Mesh(sliderGeo, sliderMaterials);
sliders.add(volumeSlider);
volumeSlider.name = "volumeS";
volumeSlider.position.set(-0.5, 0, 0);

// RATE SLIDER
const rateSlider = new THREE.Mesh(sliderGeo, sliderMaterials);
sliders.add(rateSlider);
rateSlider.name = "rateS";
rateSlider.position.set(0, 0, 0);

//SLIDERS NOBS ####################################################################################################
const nobGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 32);
const nobMat = new THREE.MeshStandardMaterial({ color: 0x941c2f });

const volumeNob = new THREE.Mesh(nobGeo, nobMat);
volumeSlider.add(volumeNob);
volumeNob.name = "vNob";
volumeNob.position.set(0, 0.05, 0);

const rateNob = new THREE.Mesh(nobGeo, nobMat);
rateSlider.add(rateNob);
rateNob.name = "rNob";
rateNob.position.set(0, 0.05, 0);

//PLATE ####################################################################################################
const plateGeometry = new THREE.CylinderGeometry(1.1, 1.2, 0.2);

const plateMaterial = new THREE.MeshStandardMaterial({
  map: textLoader.load("./src/turntable/turntable.png"),
});

const plate = new THREE.Mesh(plateGeometry, plateMaterial);
plate.position.set(-1, 0.04, 0);

turnTable.add(plate);

//NEEDLE ####################################################################################################
const needlePivot = new THREE.Group();
turnTable.add(needlePivot);
needlePivot.position.set(-2.2, 0.2, -1);

const points = [
  new THREE.Vector3(0, -0.3, 0),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0.9, 0, 0),
];

const path = new THREE.CatmullRomCurve3(points);

const tubeGeo = new THREE.TubeGeometry(path, 64, 0.05, 20, false);
const tubeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
const tubeObj = new THREE.Mesh(tubeGeo, tubeMat);

needlePivot.add(tubeObj);
needlePivot.rotation.y = -1.6;

const needleGeo = new THREE.SphereGeometry(0.08, 32);
const needleMat = new THREE.MeshStandardMaterial({
  color: 0x999999,
  roughness: 0,
  metalness: 1,
});
const needleObj = new THREE.Mesh(needleGeo, needleMat);

needlePivot.add(needleObj);

needleObj.position.set(0.85, 0, 0);

//Vinyl  ####################################################################################################
let isTrackChanging = false;
let trackChanged = false;
let direction = "next";
let currTrack = 0;

let trackCover = "./src/covers/ir.png";

function changeTrack(step) {
  isTrackChanging = true;
  direction = step;
}

function setAudioSource(index) {
  Audio.audio1.src = tracks[index].s;
}

function setCover(index) {
  trackCover = tracks[index].c;
  textLoader.load(trackCover, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    vinyl.material.map = texture;
  });
}
let tracks = [
  {
    c: "./src/covers/ir.png",
    s: "./src/tracks/IR -JTT.mp3",
  },
  {
    c: "./src/covers/bs.png",
    s: "./src/tracks/BS -WP.mp3",
  },
  {
    c: "./src/covers/yl.png",
    s: "./src/tracks/YL -A.mp3",
  },
];

let vinylTexture = textLoader.load("./src/covers/ir.png");
vinylTexture.colorSpace = THREE.SRGBColorSpace;

const vinylGeometry = new THREE.CircleGeometry(1.1, 100);
const vinylMaterial = new THREE.MeshStandardMaterial({
  map: vinylTexture,
  side: THREE.DoubleSide,
});

const vinyl = new THREE.Mesh(vinylGeometry, vinylMaterial);

vinyl.rotation.x = Math.PI / 2;
vinyl.rotation.z = Math.PI;
vinyl.position.set(-1, 0.145, 0);

turnTable.add(vinyl);

//DRAG CONTROLS ###################################################################################################
const dragObjects = [rateNob, volumeNob];
const dragControls = new DragControls(dragObjects, camera, renderer.domElement);

dragControls.addEventListener("drag", function (event) {
  event.object.position.y = 0.05;
  event.object.position.x = 0;
  if (event.object.position.z > 0.4) event.object.position.z = 0.4;
  if (event.object.position.z < -0.4) event.object.position.z = -0.4;

  const value = -event.object.position.z.toFixed(1);
  const name = event.object.name;

  Helper.nobHandler(value, name);
});

dragControls.addEventListener("dragend", function (event) {
  if (event.object.position.z < 0.1 && event.object.position.z > -0.1)
    event.object.position.z = 0;

  const value = -event.object.position.z.toFixed(1);
  const name = event.object.name;

  Helper.nobHandler(value, name);
});

let isWheeling = false;
let wheelTimeout;
let startSpeed;
let eventCounter;
let startTime;
let endTime;
let delta;

renderer.setAnimationLoop(animate);

const raycaster = new THREE.Raycaster();

window.addEventListener(
  "wheel",
  (event) => {
    if (!isWheeling) {
      console.log("Wheel Start");
      isWheeling = true;
      delta = event.deltaY;
      startSpeed = vinylSpeed;
      startTime = Audio.getTime();
      if (delta < 0) {
        endTime = startTime + 5;
        Audio.playScratch("forward");
      } else {
        endTime = startTime - 2 < 0 ? 0 : startTime - 2;
        Audio.playScratch("backward");
      }
      Audio.audio1.volume = 0;
      eventCounter = 0;
    }

    let dinamycSpeed = -event.deltaY * 0.005;
    if (delta < 0) {
      if (dinamycSpeed < startSpeed) eventCounter++;
    } else {
      if (dinamycSpeed > startSpeed) eventCounter++;
    }

    underLightL.intensity = Math.abs(event.deltaY);

    if (eventCounter < 5) {
      setVinylSpeed(dinamycSpeed);
    } else if (vinylSpeed !== startSpeed) {
      setVinylSpeed(startSpeed);
    } else {
      setVinylSpeed(dinamycSpeed);
    }

    clearTimeout(wheelTimeout);

    wheelTimeout = setTimeout(() => {
      console.log("Wheel End");
      isWheeling = false;
      Audio.stopScratch();

      Audio.audio1.currentTime = endTime;
      Audio.audio1.volume = 0.5;

      endTime = Audio.getTime();
      setVinylSpeed(startSpeed);
    }, 150);
  },
  { passive: true }
);

document.addEventListener("click", onClickEvent);

function onClickEvent(event) {
  const coords = new THREE.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1)
  );

  raycaster.setFromCamera(coords, camera);

  const intersections = raycaster.intersectObjects(scene.children, true);

  if (intersections.length > 0) {
    const selectedObject = intersections[0].object;

    if (selectedObject.name === "playB") {
      isPlaying = true;
    }
    if (selectedObject.name === "pauseB") isPlaying = false;
    if (selectedObject.name === "resetB") resetTrack();
    if (selectedObject.name === "prevB" && Audio.audio1.paused)
      changeTrack("prev");
    if (selectedObject.name === "nextB" && Audio.audio1.paused)
      changeTrack("next");
  }
}

export function setVinylSpeed(v) {
  vinylSpeed = v;
}

function resetTrack() {
  isPlaying = false;
  resetTrackFlag = true;
  Audio.resetTime();
  Audio.audio1.volume = 0.5;
  Audio.audio1.playbackRate = 1;
  setVinylSpeed(0.05);
}

let needleTarget = -0.8;
let needleReached = false;
let isPlaying = false;
let audioPaused = false;
let resetTrackFlag = false;
let vinylSpeed;

function animate() {
  if (vinyl.rotation.z > 3 * Math.PI) vinyl.rotation.z = Math.PI;

  if (isPlaying) {
    if (needlePivot.rotation.y < needleTarget) {
      needlePivot.rotation.y += 0.02;
    } else {
      if (!needleReached) {
        Audio.playAudio();
        audioPaused = false;

        needleReached = true;
        needleTarget = -1.6;
      }
      vinyl.rotation.z += vinylSpeed;
    }
  }

  if (!isPlaying) {
    if (!audioPaused) {
      Audio.pauseAudio();
      audioPaused = true;
    }

    if (needlePivot.rotation.y > needleTarget) {
      needlePivot.rotation.y -= 0.02;
    } else {
      needleReached = false;
      needleTarget = -0.8;
    }

    if (!needleReached && resetTrackFlag) {
      if (volumeNob.position.z != 0) {
        if (volumeNob.position.z > 0) volumeNob.position.z -= 0.01;
        else volumeNob.position.z += 0.01;
      }

      if (rateNob.position.z != 0) {
        if (rateNob.position.z > 0) rateNob.position.z -= 0.01;
        else rateNob.position.z += 0.01;
      }

      if (vinyl.rotation.z.toFixed(1) > Math.PI.toFixed(1)) {
        vinyl.rotation.z -= 0.08;
      }

      if (
        volumeNob.position.z < 0.01 &&
        volumeNob.position.z > -0.01 &&
        rateNob.position.z < 0.01 &&
        rateNob.position.z > -0.01 &&
        vinyl.rotation.z.toFixed(1) == Math.PI.toFixed(1)
      ) {
        console.log("reached");
        resetTrackFlag = false;
      }
    }
  }

  if (isTrackChanging) {
    vinyl.rotation.z += 2;
    if (!trackChanged) {
      if (direction === "next") {
        currTrack = currTrack == 2 ? 0 : currTrack + 1;
      } else {
        currTrack = currTrack == 0 ? 2 : currTrack - 1;
      }
      setAudioSource(currTrack);
      setCover(currTrack);
      trackChanged = true;
      switch (currTrack) {
        case 0:
          setLightColor(0xffff00);
          break;
        case 1:
          setLightColor(0x4a314d);
          break;
        case 2:
          setLightColor(0xa70000);
          break;
      }
    }
    setTimeout(() => {
      console.log("Changed");
      vinyl.rotation.z = Math.PI;
      isTrackChanging = false;
      trackChanged = false;
    }, 200);
  }

  if (!Audio.audio1.paused) {
    capsuleMat.color.set(0x00ff00);
    tableLight.intensity = 0.1;
  } else {
    capsuleMat.color.set(0x000000);
    tableLight.intensity = 0;
  }
  renderer.render(scene, camera);
}
