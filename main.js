import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import * as Helper from "./helperFunctions.js";
import * as Audio from "./audio.js";

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

camera.position.y = 6;
camera.position.z = 2;
camera.position.x = 0;
camera.rotation.x = -Math.PI / 3;

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#000000ff");
document.body.appendChild(renderer.domElement);

//Table ####################################################################################################
const tableGeometry = new THREE.BoxGeometry(8, 4, 4);
const tableMaterial = new THREE.MeshBasicMaterial({
  color: 0x652365,
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
const playButton = new THREE.Mesh(buttonGeo, buttonMat);
turnTable.add(playButton);
playButton.name = "playB";
playButton.position.set(0.7, 0.1, 0.9);

// PAUSE BUTTON
const pauseButton = new THREE.Mesh(buttonGeo, buttonMat);
turnTable.add(pauseButton);
pauseButton.name = "pauseB";
pauseButton.position.set(1.1, 0.1, 0.9);

// RESET BUTTON
const resetButton = new THREE.Mesh(buttonGeo, buttonMat);
turnTable.add(resetButton);
resetButton.name = "resetB";
resetButton.position.set(1.5, 0.1, 0.9);

//SLIDERS ####################################################################################################
const sliderGeo = new THREE.BoxGeometry(0.3, 0.2, 1);
const sliderMat = new THREE.MeshNormalMaterial();

const sliders = new THREE.Group();
turnTable.add(sliders);
sliders.position.set(1.4, 0.1, 0);

// VOLUME SLIDER
const volumeSlider = new THREE.Mesh(sliderGeo, sliderMat);
sliders.add(volumeSlider);
volumeSlider.name = "volumeS";
volumeSlider.position.set(-0.5, 0, 0);

// RATE SLIDER
const rateSlider = new THREE.Mesh(sliderGeo, sliderMat);
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

//obitControls ####################################################################################################
/* const controls = new OrbitControls(camera, renderer.domElement);
scene.add(controls); */

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

  console.log("rate:", Audio.audio1.playbackRate);
  console.log("speed", vinylSpeed);
});

let needleTarget = -0.8;
let needleReached = false;
let isPlaying = false;
let audioPaused = false;
let resetTrackFlag = false;
let vinylSpeed;

export function setVinylSpeed(v) {
  vinylSpeed = v;
}

renderer.setAnimationLoop(animate);

const raycaster = new THREE.Raycaster();

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

    if (selectedObject.name === "playB") isPlaying = true;
    if (selectedObject.name === "pauseB") isPlaying = false;
    if (selectedObject.name === "resetB") resetTrack();
  }
}

function resetTrack() {
  isPlaying = false;
  resetTrackFlag = true;
  Audio.resetTime();
  Audio.audio1.volume = 0.5;
  Audio.audio1.playbackRate = 1;
}

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
        volumeNob.position.z == 0 &&
        rateNob.position.z == 0 &&
        vinyl.rotation.z.toFixed(1) == Math.PI.toFixed(1)
      ) {
        resetTrackFlag = false;
      }
    }
  }

  renderer.render(scene, camera);
}
