
import * as THREE from "three";

function createGridHelperAndAxesHelper(scene) {
  const gridHelper = new THREE.GridHelper(2, 20, 0xeeeeee, 0xeeeeee);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.depthWrite = false;
  // gridHelper.material.transparent = true;
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(0.5);
  scene.add(axesHelper);
}

function createLight(scene) {
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


function setOrbitControls(orbitControls) {
  orbitControls.autoRotate = false;
  orbitControls.autoRotateSpeed = 0.5;
  orbitControls.enableDamping = true;
  // orbitControls.enableZoom = false;
  // orbitControls.enablePan = false;
}


function obtainMouseCoords(event, canvas, mouseCoords) {
  const rect = canvas.getBoundingClientRect();
  const localX = event.clientX - rect.left;
  const localY = event.clientY - rect.top;
  mouseCoords.x = (2 * (localX - canvas.clientWidth / 2)) / canvas.clientWidth;
  mouseCoords.y = (2 * (-localY + canvas.clientHeight / 2)) / canvas.clientHeight;
  console.log("screen:", event.clientX, event.clientY, "canvas:", mouseCoords.x, mouseCoords.y);
  return mouseCoords;
}

function setGUIinWrapper(gui, wrapper, controls) {
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

  gui.title("Controls");
  gui.close();
  gui.add(eventObj, "FullScreen");
  gui.add(eventObj, "ExitFullScreen");
  let folder = gui.addFolder("OrbitControls");
  // folder.close();
  folder.add(controls, "autoRotate").name("Auto Rotate");
  folder.add(controls, "autoRotateSpeed", 0.1, 5).name("Auto Rotate Speed");
}

function setRender(renderer, dpr, canvasWidth, canvasHeight) {
  renderer.setClearColor(0xeeeeee, 1);
  renderer.setPixelRatio(dpr);
  renderer.setSize(canvasWidth, canvasHeight, false);
  // renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  // renderer.setAnimationLoop(animate);
}

function resetRenderer(canvas, camera, renderer) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

export { createGridHelperAndAxesHelper, createLight, setOrbitControls,  obtainMouseCoords, setGUIinWrapper, setRender, resetRenderer };