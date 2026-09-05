import * as THREE from "three";
import { deskThickness } from "./desk.js";

const torusOuterRadius = 0.2;
const torusInnerRadius = 0.05;

const torus = new THREE.Mesh(new THREE.TorusGeometry(torusOuterRadius, torusInnerRadius, 12, 48, (7 / 4) * Math.PI, 0, 2 * Math.PI), new THREE.MeshStandardMaterial({ color: 0x66aaaa, roughness: 0.5, metalness: 0.5, wireframe: true }));

torus.position.set(0, torusOuterRadius + torusInnerRadius + deskThickness / 2, 0);


export { torus };
