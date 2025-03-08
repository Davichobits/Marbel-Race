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
  color: 0x00ff00
});
cube.castShadow = true;
scene.add(cube);

// GROUND
const ground = new Box({
  width: 10,
  height: 0.5,
  depth: 10,
  color: 0x3365ff
})
ground.receiveShadow = true;
ground.position.y = -2;
ground.update();
scene.add(ground);

// LIGHT
const color = 0XFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.y = 3;
light.position.z = 2;
// SHADOW
light.castShadow = true;

scene.add(light);

camera.position.z = 5;

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  if(cube.bottom > ground.top){
    cube.position.y -= 0.01;
  }else{
    cube.position.y = cube.position.y
  }
  cube.update();
}
animate()