import * as THREE from "three";
// import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const floorLength = 2.2;
const floorWidth = 1.5;
const floorHeight = 0.01;

const floor = new THREE.Mesh(
  new THREE.BoxGeometry(floorLength, floorHeight, floorWidth, 10, 10, 5),
  new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    wireframe: false,
  }),
);

floor.castShadow = true;
floor.receiveShadow = true;

export { floor, floorLength, floorWidth, floorHeight };
