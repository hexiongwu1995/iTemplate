import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import * as CANNON from "cannon-es";
// import { threeToCannon, ShapeType } from "three-to-cannon";
import { floor, floorLength, floorHeight, floorWidth } from "./floor.js";
import { createGridHelperAndAxesHelper, createLight, setOrbitControls, obtainMouseCoords, setGUIinWrapper, setRender, resetRenderer } from "./setting.js";

const dpr = window.devicePixelRatio;
const canvas = document.getElementById("canvas-main");
const width = canvas.clientWidth;
const height = canvas.clientHeight;

const camera = new THREE.PerspectiveCamera(70, (1 * width) / (1 * height), 0.01, 100);
camera.position.set(0, 0.5, 1.4);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
scene.add(floor);
createGridHelperAndAxesHelper(scene);
createLight(scene);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
setRender(renderer, dpr, width, height);
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

  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
  world.fixedStep();
  // Run the simulation independently of framerate every 1 / 60 s
}

animate();

const wrapper = document.querySelector(".canvas-wrapper");
const gui = new GUI({ container: wrapper });
setGUIinWrapper(gui, wrapper, controls);
