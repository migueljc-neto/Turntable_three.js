import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import * as Helper from "./helperFunctions.js";
import * as Audio from "./audio.js";

let moveCamera = false;

const moveCamBtn = document.getElementById("moveBtn");
moveCamBtn.addEventListener("click", () => (moveCamera = true));
window.addEventListener("load", () => {
  Audio.audio1.volume = 0.5;
  Audio.audio1.playbackRate = 1;
  setVinylSpeed(0.05);
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
const axesHelper = new THREE.AxesHelper(5);
const gridHelper = new THREE.GridHelper(5);
scene.add(axesHelper);
scene.add(gridHelper);

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

for (let i = 0; i < 4; i++) {
  let light = new THREE.PointLight(0xffff00, 30);
  light.position.set(...mainLightPosition[i]);
  light.castShadow = true;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  scene.add(light);
}

const underLightL = new THREE.PointLight(0x7e111a, 10);
underLightL.position.set(0, 0, -5);
underLightL.castShadow = true;

underLightL.shadow.mapSize.width = 1024;
underLightL.shadow.mapSize.height = 1024;

scene.add(underLightL);
//Table ####################################################################################################
const tableTexture = textLoader.load(`./src/tableTexture.png`);

const tableGeometry = new THREE.BoxGeometry(8, 4, 4);
const tableMaterial = new THREE.MeshStandardMaterial({
  color: 0x8787a8,
  roughness: 1,
  metalness: 0,
  map: tableTexture,
  wireframe: false,
});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, 0.5, 0);

scene.add(table);

//TURNTABLE ####################################################################################################
const turnTableGeometry = new THREE.BoxGeometry(5, 0.2, 2.5);
const turnTableMaterial = new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide,
  wireframe: false,
});
const turnTable = new THREE.Mesh(turnTableGeometry, turnTableMaterial);
turnTable.position.set(0, 2.6, 0);

scene.add(turnTable);

//BUTTON ####################################################################################################
const buttonGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const buttonMat = new THREE.MeshNormalMaterial();

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
sliders.position.set(1.4, 0.1, 0);

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
const nobGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.2, 32);
const nobMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

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
const plateMaterial = new THREE.MeshBasicMaterial({
  color: 0xd4d8d8,
  reflectivity: 1,
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
const tubeMat = new THREE.MeshStandardMaterial({ color: 0x2194ce });
const tubeObj = new THREE.Mesh(tubeGeo, tubeMat);

needlePivot.add(tubeObj);
needlePivot.rotation.y = -1.6;

const needleGeo = new THREE.SphereGeometry(0.08, 32);
const needleMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const needleObj = new THREE.Mesh(needleGeo, needleMat);

needlePivot.add(needleObj);

needleObj.position.set(0.85, 0, 0);

//Vinyl  ####################################################################################################
const vinylTexture = textLoader.load(`./src/vinylCover.png`);
vinylTexture.colorSpace = THREE.SRGBColorSpace;

const vinylGeometry = new THREE.CircleGeometry(1.1, 100);
const vinylMaterial = new THREE.MeshBasicMaterial({
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
let cameraTarget = { x: 0, y: 8, z: 2 };
let direction = "+";

let needleTarget = -0.8;
let needleReached = false;
let isPlaying = false;
let audioPaused = false;
let resetTrackFlag = false;
let vinylSpeed;

function animate() {
  if (moveCamera) {
    let posX = camera.position.x.toFixed(2);
    let posY = camera.position.y.toFixed(2);
    let posZ = camera.position.z.toFixed(2);

    if (direction === "+") {
      if (posX != cameraTarget.x) {
        camera.position.x += 0.1;
      }
      if (posY != cameraTarget.y) {
        camera.position.y += 0.1;
      }
      if (posZ != cameraTarget.z) {
        camera.position.z += 0.1;
      }
    }

    if (direction === "-") {
      if (posX != cameraTarget.x) {
        camera.position.x -= 0.1;
      }
      if (posY != cameraTarget.y) {
        camera.position.y -= 0.1;
      }
      if (posZ != cameraTarget.z) {
        camera.position.z -= 0.1;
      }
    }

    if (
      posX == cameraTarget.x &&
      posZ == cameraTarget.z &&
      posY == cameraTarget.y
    ) {
      moveCamera = false;
      cameraTarget =
        direction == "+" ? { x: 0, y: 6, z: 2 } : { x: 0, y: 8, z: 2 };
      direction = direction == "+" ? "-" : "+";
      console.log(direction, cameraTarget, camera.position);
    }
  }

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

  renderer.render(scene, camera);
}
