import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { floor, floorLength, floorWidth, floorHeight } from "./floor.js";
import { createBall } from "./ball.js";
const dpr = window.devicePixelRatio;
const canvas = document.getElementById("canvas-main");
const width = canvas.clientWidth;
const height = canvas.clientHeight;
const ballRadius = 0.08;
const ballHeight = ballRadius;

const camera = new THREE.PerspectiveCamera(60, (1 * width) / (1 * height), 0.01, 100);
camera.position.set(0, 1, 1);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
// scene.add(desk);
scene.add(floor);
floor.position.set(0, -floorHeight / 2, 0);

const ball1 = createBall(ballRadius);
ball1.position.set(-0.3, ballHeight, 0);
scene.add(ball1);
const ball2 = createBall(ballRadius);
ball2.position.set(0, ballHeight, 0);
scene.add(ball2);
const ball3 = createBall(ballRadius);
ball3.position.set(0.3, ballHeight, 0);
scene.add(ball3);

// desk.castShadow = true;
// desk.receiveShadow = true;

const cameraHelper = new THREE.CameraHelper(camera);
// scene.add(cameraHelper);

const gridHelper = new THREE.GridHelper(2, 20, 0xffffff, 0xeeeeee);
gridHelper.material.opacity = 0.2;
gridHelper.material.depthWrite = false;
// gridHelper.material.transparent = true;

scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(1.2);
scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.position.set(0.5, 0.5, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(4096, 4096);
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

const balls = [ball1, ball2, ball3];
balls.forEach((ball) => {
  ball.updateMatrixWorld();
});

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setClearColor(0xeeeeee, 1);
renderer.setPixelRatio(dpr);
renderer.setSize(width, height, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);
// renderer.setAnimationLoop(animate);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;
// controls.autoRotateSpeed = 1;
controls.enableDamping = true;

const rayCaster = new THREE.Raycaster();

const mouseCoords = new THREE.Vector2();
canvas.addEventListener("mousedown", (event) => {
  // 获取 canvas 相对于视口的位置
  const rect = canvas.getBoundingClientRect();
  // 计算鼠标相对于 canvas 左上角的坐标
  const localX = event.clientX - rect.left;
  const localY = event.clientY - rect.top;
  // 以 canvas 中心为原点，水平向右为 x 正方向，竖直向上为 y 正方向
  mouseCoords.x = (2 * (localX - canvas.clientWidth / 2)) / canvas.clientWidth;
  mouseCoords.y = (2 * (-localY + canvas.clientHeight / 2)) / canvas.clientHeight;
  rayCaster.setFromCamera(mouseCoords, camera);

  for (const ball of balls) {
    ball.material.color.set(0xffffff);
  }

  const intersects = rayCaster.intersectObjects(balls);
  // console.log(intersects);
  for (const intersect of intersects) {
    intersect.object.material.color.set(0xff0000);
  }

  console.log("screen:", event.clientX, event.clientY, "canvas:", mouseCoords.x, mouseCoords.y);
});

const timer = new THREE.Timer();
timer.connect(document);

function animate() {
  ball1.rotation.y += 0.01;
  ball2.rotation.y += 0.02;
  ball3.rotation.y += 0.03;

  timer.update();

  ball1.position.y = 0.5 * Math.abs(Math.sin(timer.getElapsed())) + ballHeight;
  ball2.position.y = 0.5 * Math.abs(Math.sin(timer.getElapsed() + Math.PI / 4)) + ballHeight;
  ball3.position.y = 0.5 * Math.abs(Math.sin(timer.getElapsed() + Math.PI / 2)) + ballHeight;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
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
const wrapper = document.querySelector(".canvas-wrapper");
wrapper.style.backgroundColor = "#eeeeee";

let eventObj = {
  FullScreen: function () {
    wrapper.requestFullscreen();
    console.log("FullScreen");
  },
  ExitFullScreen: function () {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      console.log("ExitFullScreen");
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
