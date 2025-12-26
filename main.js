import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import * as Helper from "./helperFunctions.js";

/*********************
 * SCENE
 * *******************/
// create an empty scene, that will hold all our elements such as objects, cameras and lights
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, //abertura de lente
  window.innerWidth / window.innerHeight, //racio
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
renderer.setClearColor("#c8c8c8");
document.body.appendChild(renderer.domElement);

//Table ####################################################################################################
const tableGeometry = new THREE.BoxGeometry(8, 4, 4);
const tableMaterial = new THREE.MeshBasicMaterial({
  color: 0x652365,
  wireframe: true,
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
const playButton = new THREE.Mesh(buttonGeo, buttonMat, "playB");
turnTable.add(playButton);
playButton.position.set(0.7, 0.1, 0.9);

// PAUSE BUTTON
const pauseButton = new THREE.Mesh(buttonGeo, buttonMat, "pauseB");
turnTable.add(pauseButton);
pauseButton.position.set(1.1, 0.1, 0.9);

// RESET BUTTON
const resetButton = new THREE.Mesh(buttonGeo, buttonMat, "resetB");
turnTable.add(resetButton);
resetButton.position.set(1.5, 0.1, 0.9);

//SLIDERS ####################################################################################################
const sliderGeo = new THREE.BoxGeometry(0.3, 0.2, 1);
const sliderMat = new THREE.MeshNormalMaterial();

// VOLUME SLIDER
const volumeSlider = new THREE.Mesh(sliderGeo, sliderMat, "volumeS");
turnTable.add(volumeSlider);
volumeSlider.position.set(0.8, 0.04, 0);

// RATE SLIDER
const rateSlider = new THREE.Mesh(sliderGeo, sliderMat, "rateS");
turnTable.add(rateSlider);
rateSlider.position.set(1.4, 0.04, 0);

//SLIDERS NOBS ####################################################################################################
const nobGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
const nobMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const volumeNob = new THREE.Mesh(nobGeo, nobMat);
volumeSlider.add(volumeNob);
volumeNob.position.set(0, 0.05, 0);

const rateNob = new THREE.Mesh(nobGeo, nobMat);
rateSlider.add(rateNob);
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
needlePivot.position.set(-2.2, 0.3, -1);

const points = [
  new THREE.Vector3(0, -0.5, 0),
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
vinyl.position.set(-1, 2.85, 0);

scene.add(vinyl);

//obitControls ####################################################################################################
/* const controls = new TransformControls(camera, renderer.domElement);
controls.setMode("rotate");

controls.showX = false;
controls.showZ = false;

controls.size = 1.9;

console.log(controls.getHelper());

controls.attach(vinyl);
scene.add(controls.getHelper());
console.log(controls);
 */
renderer.setAnimationLoop(animate);

let setPlateRotation = false;
const testButton = document.getElementById("buttonPlay");

testButton.addEventListener("click", function () {
  setPlateRotation = !setPlateRotation;
});

function animate() {
  if (setPlateRotation) {
    testObj.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

//teste funçoes

window.addEventListener("wheel", function (e) {
  const delta = e.deltaY;
  console.log(delta);
  /* Helper.teste(); */
});

function animatecube() {
  if (coverPivot.rotation.x < Math.PI / 2) {
    coverPivot.rotation.x += 0.075;
  }

  window.requestAnimationFrame(animatecube);
}

/* window.addEventListener("click", () => {
  animatecube();
}); */
