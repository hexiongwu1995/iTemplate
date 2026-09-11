import * as THREE from "three";
// import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const floorLength = 2;
const floorHeight = 0.02;
const floorWidth = 1;

const floor = new THREE.Mesh(
  new THREE.BoxGeometry(floorLength, floorHeight, floorWidth, 10, 5, 10),
  new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    wireframe: false,
  }),
);

floor.castShadow = true;
floor.receiveShadow = true;
floor.position.set(0, -floorHeight / 2, 0);

export { floor, floorLength,  floorHeight, floorWidth };
