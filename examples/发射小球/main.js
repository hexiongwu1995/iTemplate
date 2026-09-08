import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import * as CANNON from "cannon-es";
import { threeToCannon, ShapeType } from 'three-to-cannon';
import { floor, floorLength, floorWidth, floorHeight } from "./floor.js";
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
floor.position.set(0, -floorHeight / 2, 0);

// 创建物理引擎
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
});

// 创建物理材质
const physicsMaterial = new CANNON.Material("physics");

const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
  friction: 0.7,
  restitution: 0.9,
})
world.addContactMaterial(physics_physics);

// 创建物理地面
const floorBody = new CANNON.Body({
  // mass: 0,
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(floorLength / 2, floorHeight / 2, floorWidth / 2)),
  position: new CANNON.Vec3(0, -floorHeight / 2, 0),
  material: physicsMaterial,
});
world.addBody(floorBody);

const ball1 = createBall(ballRadius);
ball1.position.set(-0.9, ballRadius + 0.5, 0);
scene.add(ball1);

// 创建物理小球
const sphereBody = new CANNON.Body({
  mass: 0.1, // kg
  shape: new CANNON.Sphere(ballRadius),
  position: ball1.position,
  material: physicsMaterial,
})
world.addBody(sphereBody)
// sphereBody.applyLocalForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0, 0, 0));
sphereBody.applyLocalForce(new CANNON.Vec3(20, 0, 0), new CANNON.Vec3(0, - 0.9 * ballRadius, 0));

// 渲染器
// const cameraHelper = new THREE.CameraHelper(camera);
// scene.add(cameraHelper);

const gridHelper = new THREE.GridHelper(2, 22, 0xeeeeee, 0xeeeeee);
gridHelper.material.opacity = 0.2;
gridHelper.material.depthWrite = false;
// gridHelper.material.transparent = true;

scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(0.5);
scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
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

ball1.updateMatrixWorld();

// const balls = [ball1, ball2, ball3];
// balls.forEach((ball) => {
//   ball.updateMatrixWorld();
// });

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setClearColor(0xeeeeee, 1);
renderer.setPixelRatio(dpr);
renderer.setSize(width, height, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);
// renderer.setAnimationLoop(animate);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
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

  ball1.material.color.set(0xffffff);

  // for (const ball of balls) {
  //   ball.material.color.set(0xffffff);
  // }

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
  
  timer.update();
  world.fixedStep();
  
  ball1.position.copy(sphereBody.position);
  ball1.quaternion.copy(sphereBody.quaternion);

  // ball1.rotation.y += 0.01;
  // ball1.position.y = 0.5 * Math.abs(Math.sin(timer.getElapsed())) + ballRadius;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  // Run the simulation independently of framerate every 1 / 60 s
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
