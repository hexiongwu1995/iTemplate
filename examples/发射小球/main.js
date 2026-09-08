import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import * as CANNON from "cannon-es";
import { threeToCannon, ShapeType } from "three-to-cannon";
import { floor, floorLength, floorHeight, floorWidth } from "./floor.js";
import { createBall } from "./ball.js";

const dpr = window.devicePixelRatio;
const canvas = document.getElementById("canvas-main");
const width = canvas.clientWidth;
const height = canvas.clientHeight;
const ballRadius = 0.05;

const camera = new THREE.PerspectiveCamera(70, (1 * width) / (1 * height), 0.01, 100);
camera.position.set(0, 0.5, 1.4);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

scene.add(floor);
const loader = new THREE.TextureLoader();
const ballTexture = loader.load("../../Textures/earth_day_4096.jpg");

function createGridHelperAndAxesHelper() {
  const gridHelper = new THREE.GridHelper(2, 22, 0xeeeeee, 0xeeeeee);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.depthWrite = false;
  // gridHelper.material.transparent = true;
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(0.5);
  scene.add(axesHelper);
}
createGridHelperAndAxesHelper();

function createLight() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
  directionalLight.position.set(0.5, 0.5, 0.5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(2048, 2048);
  scene.add(directionalLight);

  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.05, 0xff00ff);
  scene.add(directionalLightHelper);

  // const pointLight = new THREE.PointLight(0xffffff, 1.9, 10)
  // pointLight.position.set(0, 2, 0);
  // pointLight.castShadow = true;
  // pointLight.shadow.mapSize.set(4096, 4096);
  // scene.add(pointLight);

  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1, 0xff00ff);
  // scene.add(pointLightHelper);
}
createLight();

function obtainMouseCoords(event, canvas, mouseCoords) {
  const rect = canvas.getBoundingClientRect();
  const localX = event.clientX - rect.left;
  const localY = event.clientY - rect.top;
  mouseCoords.x = (2 * (localX - canvas.clientWidth / 2)) / canvas.clientWidth;
  mouseCoords.y = (2 * (-localY + canvas.clientHeight / 2)) / canvas.clientHeight;
  console.log("screen:", event.clientX, event.clientY, "canvas:", mouseCoords.x, mouseCoords.y);
  return mouseCoords;
}

function shootBall(position, direction, ballMaterial) {
  const visualBall = createBall(ballRadius, ballTexture);
  visualBall.position.copy(position);

  const physicsBall = new CANNON.Body({
    mass: 0.1,
    shape: new CANNON.Sphere(ballRadius),
    position: new CANNON.Vec3(position.x, position.y, position.z),
    material: ballMaterial,
    linearDamping: 0.9,
  });

  world.addBody(physicsBall);

  // visualBall.updateMatrixWorld();
  balls.push({ visualBall, physicsBall });
  scene.add(visualBall);
  physicsBall.applyLocalForce(new CANNON.Vec3(direction.x, direction.y, direction.z).scale(500), new CANNON.Vec3(0, -0.9 * ballRadius, 0));
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
  const ballOrigin = camera.position;
  const ballDirection = new THREE.Vector3(mouseCoords.x, mouseCoords.y, -1).unproject(camera).sub(camera.position).normalize();
  shootBall(ballOrigin, ballDirection, physicsMaterial);
});

canvas.addEventListener("click", (event) => {
  obtainMouseCoords(event, canvas, mouseCoords);
  changeColorWhenClick(mouseCoords, camera, balls);
});

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
function setRender() {
  renderer.setClearColor(0xeeeeee, 1);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.render(scene, camera);
  // renderer.setAnimationLoop(animate);
}
setRender();

const controls = new OrbitControls(camera, renderer.domElement);
function setOrbitControls() {
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enableDamping = true;
}
setOrbitControls();

function resetRenderer(canvas, camera, renderer) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

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
  for (const { visualBall, physicsBall } of balls) {
    visualBall.position.copy(physicsBall.position);
    visualBall.quaternion.copy(physicsBall.quaternion);
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  world.fixedStep();
  // Run the simulation independently of framerate every 1 / 60 s
}

animate();

function createGUIinWrapper() {
  const wrapper = document.querySelector(".canvas-wrapper");
  wrapper.style.backgroundColor = "#eeeeee";

  let eventObj = {
    FullScreen: function () {
      wrapper.requestFullscreen();
      console.log("FullScreen mode enabled");
    },
    ExitFullScreen: function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        console.log("FullScreen mode disabled");
      } else {
        console.log("Not in fullscreen mode");
      }
    },
  };

  const gui = new GUI({ container: wrapper });

  gui.title("Controls");
  gui.close();
  gui.add(eventObj, "FullScreen");
  gui.add(eventObj, "ExitFullScreen");
  let folder = gui.addFolder("OrbitControls");
  // folder.close();
  folder.add(controls, "autoRotate").name("Auto Rotate");
  folder.add(controls, "autoRotateSpeed", 0.1, 5).name("Auto Rotate Speed");
}

createGUIinWrapper();
