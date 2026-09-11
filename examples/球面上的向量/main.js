import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import * as CANNON from "cannon-es";

import { createGridHelperAndAxesHelper, createLight, createPointLight, setOrbitControls, obtainMouseCoords, setGUIinWrapper, setRender, resetRenderer } from "../../dist/three/setting.js";
import { sphCoords, createLine } from "../../dist/three/utils.js";

const dpr = window.devicePixelRatio;
const canvas = document.getElementById("canvas-vector-on-a-sphere");
const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(70, (1 * canvasWidth) / (1 * canvasHeight), 0.01, 100);
camera.position.set(0, 0.5, 1.4);
camera.lookAt(0, 0, 0);

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

createLight(scene);

const sphereRadius = 0.4;
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(sphereRadius, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  }),
);
// sphere.position.set(0, sphereRadius, 0);
scene.add(sphere);


const orbit1 = new THREE.Mesh(
  new THREE.RingGeometry(sphereRadius - 0.01, sphereRadius, 32, 2, 0, 2 * Math.PI),
  new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  }),
);
orbit1.rotation.x = Math.PI / 2;
sphere.add(orbit1);


const radiusOrbit2 = sphereRadius * Math.sin(Math.PI / 4);
const orbit2 = new THREE.Mesh(
  new THREE.RingGeometry(radiusOrbit2 - 0.01, radiusOrbit2, 32, 2, 0, 2 * Math.PI),
  new THREE.MeshStandardMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  }),
);
orbit2.position.set(0, sphereRadius * Math.cos(Math.PI / 4), 0);
orbit2.rotation.x = Math.PI / 2;
sphere.add(orbit2);


const vec1 = createLine(new THREE.Vector3(0, 0, 0), sphCoords(sphereRadius, Math.PI / 4, Math.PI / 8), {
  color: 0x00ff00,
});
scene.add(vec1);

// vec1.position.x += 0.5;
// vec1.rotation.y = Math.PI / 2;
// vec1.visible = false;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
setRender(renderer, dpr, canvasWidth, canvasHeight);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);
setOrbitControls(controls);

window.addEventListener("resize", () => {
  resetRenderer(canvas, camera, renderer);
});

document.addEventListener("fullscreenchange", () => {
  // 延迟一帧，确保全屏布局完成
  requestAnimationFrame(() => {
    resetRenderer(canvas, camera, renderer);
  });
});

const timer = new THREE.Timer();
timer.connect(document);

function animate() {
  timer.update();
  vec1.rotation.y += 0.005;
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
  // world.fixedStep();
  // Run the simulation independently of framerate every 1 / 60 s
}

animate();

const wrapper = document.querySelector(".canvas-wrapper");
const gui = new GUI({ container: wrapper });
setGUIinWrapper(gui, wrapper, controls);
