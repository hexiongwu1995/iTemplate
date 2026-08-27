import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js';

// init

const container = document.getElementById( 'first-container' );
let width = container.clientWidth;
let height = container.clientHeight;

const camera = new THREE.PerspectiveCamera( 70, (1 * width) / (1 * height ), 0.01, 10 );
camera.position.z = 3;
camera.position.x = 0;
camera.position.y = 0;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
renderer.setClearColor( 0x0000ff, 0.01); 
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
container.appendChild( renderer.domElement );

// handle resize

window.addEventListener( 'resize', onResize );

function onResize() {

	width = container.clientWidth;
	height = container.clientHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );

}

// animation

function animate( time ) {

	mesh.rotation.x = time / 20000;
	mesh.rotation.y = time / 10000;

	renderer.render( scene, camera );

}