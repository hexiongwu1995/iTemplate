import * as THREE from "three";

const deskLength = 1.4;
const deskWidth = 0.7;
const deskThickness = 0.025;

const textureLoader = new THREE.TextureLoader();

const deskTexture = textureLoader.load("../../Textures/Poliigon_WoodVeneerOak_7760/2K/Poliigon_WoodVeneerOak_7760_BaseColor.jpg");
const aoTexture = textureLoader.load("../../Textures/Poliigon_WoodVeneerOak_7760/2K/Poliigon_WoodVeneerOak_7760_AmbientOcclusion.jpg");
const displacementTexture = textureLoader.load("../../Textures/Poliigon_WoodVeneerOak_7760/2K/Poliigon_WoodVeneerOak_7760_Displacement.jpg");
const metalnessTexture = textureLoader.load("../../Textures/Poliigon_WoodVeneerOak_7760/2K/Poliigon_WoodVeneerOak_7760_Metallic.jpg");
const normalTexture = textureLoader.load("../../Textures/Poliigon_WoodVeneerOak_7760/2K/Poliigon_WoodVeneerOak_7760_Normal.png");
const roughnessTexture = textureLoader.load("../../Textures/Poliigon_WoodVeneerOak_7760/2K/Poliigon_WoodVeneerOak_7760_Roughness.jpg");

// 设置纹理颜色空间
// 颜色类贴图(BaseColor)使用 SRGB；数据类贴图(AO/Roughness/Metallic/Normal/Displacement)保持线性(NoColorSpace)
deskTexture.colorSpace = THREE.SRGBColorSpace;

// 统一设置纹理变换：旋转 90° + 平铺 2 次
// 所有配套贴图必须同步变换，否则 BaseColor 与 Normal/Roughness 会对不上
const allTextures = [deskTexture, aoTexture, displacementTexture, metalnessTexture, normalTexture, roughnessTexture];
allTextures.forEach((t) => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.center.set(0.5, 0.5);
  t.rotation = Math.PI / 2;
  t.repeat.set(1, 2);
});

const deskGeometry = new THREE.BoxGeometry(deskLength, deskThickness, deskWidth, 64, 4, 32);
// aoMap 需要第二组 UV 坐标才能正确显示
deskGeometry.setAttribute("uv2", new THREE.BufferAttribute(deskGeometry.attributes.uv.array.slice(), 2));

const desk = new THREE.Mesh(
  deskGeometry,
  new THREE.MeshStandardMaterial({
    map: deskTexture,
    aoMap: aoTexture,
    displacementMap: displacementTexture,
    displacementScale: 0.002,
    metalnessMap: metalnessTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    metalness: 1,
    roughness: 1,
  }),
);

desk.position.set(0, 0, 0);
// desk.rotation.x = - Math.PI / 2;

export { desk, deskThickness };