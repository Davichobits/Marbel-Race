import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Box } from './utils/Box';

const scene = new THREE.Scene();

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const cube = new Box({
  width: 1,
  height: 1,
  depth:1,
});
cube.castShadow = true;
scene.add(cube);

// GROUND
const groundWidth = 10;
const groundHeight = 0.5;
const groundDepth = 10;
const groundGeometry = new THREE.BoxGeometry(groundWidth, groundHeight, groundDepth);
const groundMaterial = new THREE.MeshStandardMaterial({color: 0x3365ff});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;
ground.position.y = -2
scene.add(ground);

// LIGHT
const color = 0XFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.y = 3;
light.position.z = 2;
light.castShadow = true;

scene.add(light);

// SHADOW
console.log(cube.height / 2);

camera.position.z = 5;

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
cube.position.y -= 0.01;
}
animate()