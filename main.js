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
camera.position.z = 0;

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#c8c8c8");
document.body.appendChild(renderer.domElement);

//lights
const light = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(light);

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
const turnTableGeometry = new THREE.BoxGeometry(4, 0.2, 2.5);
const turnTableMaterial = new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide,
  wireframe: false,
});
const turnTable = new THREE.Mesh(turnTableGeometry, turnTableMaterial);
turnTable.position.set(0, 2.6, 0);

scene.add(turnTable);

//PLATE ####################################################################################################
const plateGeometry = new THREE.CylinderGeometry(1.1, 1.2, 0.2);
const plateMaterial = new THREE.MeshBasicMaterial({
  color: 0xd4d8d8,
  reflectivity: 1,
});
const plate = new THREE.Mesh(plateGeometry, plateMaterial);
plate.position.set(-0.5, 0.04, 0);

turnTable.add(plate);

//COVER ####################################################################################################
const coverPivot = new THREE.Group();
turnTable.add(coverPivot);

coverPivot.position.set(-0.5, 0, -1.2);
const coverGroup = new THREE.Group();

const coverGeo = new THREE.BoxGeometry(1, 1, 0.05);
const coverMat = new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide,
  flatShading: true,
});
const coverMain = new THREE.Mesh(coverGeo, coverMat);

coverPivot.add(coverGroup);
coverGroup.position.y = 0.5;

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
vinyl.position.set(-0.5, 2.85, 0);

scene.add(vinyl);

//obitControls ####################################################################################################
const control = new OrbitControls(camera, renderer.domElement);
/* const controls = new TransformControls(camera, renderer.domElement);
controls.setMode("rotate");

controls.showX = false;
controls.showZ = false;

controls.size = 1.9;

console.log(controls.getHelper());

controls.attach(vinyl);
scene.add(controls.getHelper());
console.log(controls); */

renderer.setAnimationLoop(animate);

function animate() {
  renderer.render(scene, camera);
  vinyl.rotation.z += 0.02;
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
