import * as THREE from "three";



function sphCoords(radius, phi,  theta) {
 return new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
}

function createLine(startPoint, endPoint, options = {}) {
  const { color = 0xaaaaaa, lineWidth = 0.002, headLengthRatio = 0.02, headWidthRatio = 0.01 } = options;

  const origin = startPoint.clone();
  const dir = endPoint.clone().sub(origin);
  const length = dir.length();
  dir.normalize();

  const group = new THREE.Group();

  // 圆柱体作为线段（可设置线宽）
  const lineGeometry = new THREE.CylinderGeometry(lineWidth, lineWidth, length * (1 - headLengthRatio / 2), 16);
  const lineMaterial = new THREE.MeshStandardMaterial({ color: color });
  const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial);

  const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
  lineMesh.position.copy(midPoint);
  lineMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  group.add(lineMesh);

  // 箭头头部（圆锥）
  const headLength = length * headLengthRatio;
  const headWidth = length * headWidthRatio;
  const coneGeometry = new THREE.ConeGeometry(headWidth, headLength, 16);
  const coneMaterial = new THREE.MeshStandardMaterial({ color: color });
  const cone = new THREE.Mesh(coneGeometry, coneMaterial);

  const conePos = endPoint.clone().sub(dir.clone().multiplyScalar(headLength / 2));
  cone.position.copy(conePos);
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  group.add(cone);
  return group;
}

export { sphCoords, createLine };