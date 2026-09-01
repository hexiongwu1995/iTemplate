import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const container = document.getElementById("lighting");

const width = container.clientWidth;
const height = container.clientHeight;

const deskLength = 1400;
const deskWidth = 700;
const deskThickness = 25;
const torusOuterRadius = 100;
const torusInnerRadius = 25;

const camera = new THREE.PerspectiveCamera(60, (1 * width) / (1 * height), 0.01, 10000);
camera.position.set(0, -1000, 400);
// camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

const desk = new THREE.Mesh(new THREE.BoxGeometry(deskLength, deskWidth, deskThickness), new THREE.MeshStandardMaterial());
desk.position.set(0, 0, - deskThickness / 2);
// desk.rotation.x = - Math.PI / 2;

const torus = new THREE.Mesh(new THREE.TorusGeometry(torusOuterRadius, torusInnerRadius), new THREE.MeshStandardMaterial());
torus.position.set(0, 0, torusOuterRadius + torusInnerRadius);
torus.rotation.x = - Math.PI / 2;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, -1, 1);



scene.add(desk, torus, ambientLight, directionalLight);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0xf1f1f1, 0.5);
renderer.setSize(width, height);
renderer.render(scene, camera);
renderer.setAnimationLoop(animate);

container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate(time) {
    controls.update();
    renderer.render(scene, camera);
}


