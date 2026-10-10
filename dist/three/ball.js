import * as THREE from "three";

function createBall(ballRadius = 0.03, ballTexture) {
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(ballRadius, 32, 32),
  new THREE.MeshStandardMaterial({
    // color: 0xffffff,
    map: ballTexture,
    // metalness: 0.9,
    // roughness: 0.1,
  }),
);
ball.castShadow = true;
ball.receiveShadow = true;
return ball;
}

export { createBall };
