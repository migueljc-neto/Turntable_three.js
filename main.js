import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
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

camera.position.y = 7;
camera.position.z = 4;

//renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("#c8c8c8");
document.body.appendChild(renderer.domElement);

//lights
const light = new THREE.AmbientLight(0x404040);
scene.add(light);
light.position.set(0, 0, 0);

//Table
const tableGeometry = new THREE.BoxGeometry(8, 4, 4);
const tableMaterial = new THREE.MeshBasicMaterial({
  color: 0x652365,
  wireframe: true,
});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.set(0, 0.5, 0);

scene.add(table);

//turntable Base
const turnTableGeometry = new THREE.BoxGeometry(4, 0.2, 2.5);
const turnTableMaterial = new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide,
});
const turnTable = new THREE.Mesh(turnTableGeometry, turnTableMaterial);
turnTable.position.set(0, 2.6, 0);

scene.add(turnTable);

//turntable Plate
const plateGeometry = new THREE.CylinderGeometry(1.1, 1.2, 0.2);
const plateMaterial = new THREE.MeshBasicMaterial({
  color: 0xd4d8d8,
  reflectivity: 1,
});

const plate = new THREE.Mesh(plateGeometry, plateMaterial);
plate.position.set(-0.5, 2.7, 0);

scene.add(plate);

//Vinyl object
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

//obitControls
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setAnimationLoop(animate);

function animate() {
  renderer.render(scene, camera);
  //vinyl.rotation.z += 0.02;
}

//teste funçoes

window.addEventListener("wheel", function (e) {
  const delta = e.deltaY;
  console.log(delta);
  /* Helper.teste(); */
});
