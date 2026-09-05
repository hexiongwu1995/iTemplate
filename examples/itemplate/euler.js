import * as THREE from "three";

const a = new THREE.Euler(0, Math.PI / 2, 0)
const b = new THREE.Vector3(0.5,0.5,0.5)

export const arrowHelper = new THREE.ArrowHelper(
  b.clone().normalize(), // 方向（需要单位向量）
  new THREE.Vector3(0, 0, 0), // 起点
  b.length(), // 长度
  0x00ffff // 颜色
);