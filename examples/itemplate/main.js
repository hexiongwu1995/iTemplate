import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { desk, deskThickness } from "./desk.js";
import { arrowHelper } from "./euler.js";
import { torus } from "./torus.js";


const canvas = document.getElementById("canvas-main");
const width = canvas.clientWidth;
const height = canvas.clientHeight;


const camera = new THREE.PerspectiveCamera(60, (1 * width) / (1 * height), 0.01, 100);
camera.position.set(0, 0.5, 1.2);
camera.lookAt(0, 0, 0);


const scene = new THREE.Scene();


const gridHelper = new THREE.GridHelper(2, 20);
const axesHelper = new THREE.AxesHelper(1.2);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);


scene.add(desk, torus, gridHelper, axesHelper, arrowHelper, ambientLight, directionalLight);


const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setClearColor(0x666666, 0.2);
renderer.setSize(width, height, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.render(scene, camera);
// renderer.setAnimationLoop(animate);


const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.enableDamping = true;


function animate() {
  requestAnimationFrame(animate);
  torus.rotation.y += (16.6 / 1000) * ((2 * Math.PI) / 20);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// 设置窗口自适应
window.addEventListener("resize", () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
});
