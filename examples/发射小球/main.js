import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import * as CANNON from "cannon-es";
import { threeToCannon, ShapeType } from "three-to-cannon";
import { floor, floorLength, floorHeight, floorWidth } from "../../dist/three/floor.js";
import { createGridHelperAndAxesHelper, createLight, setOrbitControls, obtainMouseCoords, setGUIinWrapper, setRender, resetRenderer } from "../../dist/three/setting.js";
import { createBall } from "../../dist/three/ball.js";

const dpr = window.devicePixelRatio;
const canvas = document.getElementById("canvas-main");
const width = canvas.clientWidth;
const height = canvas.clientHeight;
console.log(width, height);
const ballRadius = 0.05;

const camera = new THREE.PerspectiveCamera(70, (1 * width) / (1 * height), 0.01, 100);
camera.position.set(0, 0.5, 1.4);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

scene.add(floor);
const loader = new THREE.TextureLoader();
const ballTexture = loader.load("../../Textures/earth_day_4096.jpg");

createGridHelperAndAxesHelper(scene);

createLight(scene);

function shootBall(ballRadius, ballTexture, mass, position, ballMaterial,balls, scene, direction) {
  const visualBall = createBall(ballRadius, ballTexture);
  visualBall.position.copy(position);

  const physicsBall = new CANNON.Body({
    mass: mass,
    shape: new CANNON.Sphere(ballRadius),
    position: new CANNON.Vec3(position.x, position.y, position.z),
    material: ballMaterial,
    linearDamping: 0.9,
  });

  world.addBody(physicsBall);

  // visualBall.updateMatrixWorld();
  balls.push({ visualBall, physicsBall });
  scene.add(visualBall);
  physicsBall.applyForce(new CANNON.Vec3(direction.x, direction.y, direction.z).scale(50), new CANNON.Vec3(0, -0.9 * ballRadius, 0));
}

function changeColorWhenClick(mouseCoords, camera, balls) {
  const rayCaster = new THREE.Raycaster();
  rayCaster.setFromCamera(mouseCoords, camera);

  const visualBalls = balls.map((b) => b.visualBall);

  for (const ball of visualBalls) {
    ball.material.color.set(0xffffff);
  }

  const intersects = rayCaster.intersectObjects(visualBalls);
  for (const intersect of intersects) {
    intersect.object.material.color.set(0xff0000);
  }
}

// 创建物理引擎
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

const physicsMaterial = new CANNON.Material("physics");

const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
  friction: 0.7,
  restitution: 0.9,
});
world.addContactMaterial(physics_physics);

const floorBody = new CANNON.Body({
  // mass: 0,
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(floorLength / 2, floorHeight / 2, floorWidth / 2)),
  position: new CANNON.Vec3(0, -floorHeight / 2, 0),
  material: physicsMaterial,
});
world.addBody(floorBody);

let balls = [];

const mouseCoords = new THREE.Vector2();

canvas.addEventListener("dblclick", (event) => {
  obtainMouseCoords(event, canvas, mouseCoords);
  const ballOrigin = camera.position.clone();
  const ballDirection = new THREE.Vector3(mouseCoords.x, mouseCoords.y, -1).unproject(camera).sub(camera.position).normalize();
  shootBall(ballRadius, ballTexture, 0.1,ballOrigin, physicsMaterial, balls, scene, ballDirection);
});

canvas.addEventListener("click", (event) => {
  obtainMouseCoords(event, canvas, mouseCoords);
  changeColorWhenClick(mouseCoords, camera, balls);
});

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

// let materials = [
//   new THREE.MeshBasicMaterial({ color: 0xff0000 }),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 }),
//   new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
//   new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
//   new THREE.MeshBasicMaterial({ color: 0x0000ff }),
//   new THREE.MeshBasicMaterial({ color: 0x0000ff }),
// ];

// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(0.5, 0.5, 0.5),
//   materials,
// )

// scene.add(cube)
// cube.rotation.y = Math.PI / 2;

const timer = new THREE.Timer();
timer.connect(document);

function animate() {
  timer.update();
  for (const { visualBall, physicsBall } of balls) {
    visualBall.position.copy(physicsBall.position);
    visualBall.quaternion.copy(physicsBall.quaternion);
  }

  // cube.rotation.x = timer.getElapsed() * 0.1;
  // cube.rotation.z = timer.getElapsed() * 0.1;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  world.fixedStep();
  // Run the simulation independently of framerate every 1 / 60 s
}

animate();

const wrapper = document.querySelector(".canvas-wrapper");
const gui = new GUI({ container: wrapper });
setGUIinWrapper(gui, wrapper, controls);