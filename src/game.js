import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Box } from './utils/Box';
import { Sphere } from './utils/Sphere';

// Game variables
const boxVelocity = 0.05;

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

// GROUND
const ground = new Box({
  width: 10,
  height: 0.5,
  depth: 10,
  color: 0x3365ff,
  position:{
    x:0,
    y:-2,
    z:0,
  }
})
ground.receiveShadow = true;
scene.add(ground);

// CUBE
const cube = new Box({
  width: 1,
  height: 1,
  depth:1,
  color: 0x00ff00,
  velocity:{
    x: 0,
    y: -0.01,
    z: 0
  }
});
cube.castShadow = true;
scene.add(cube);

// SPHERE
const sphere = new Sphere({
  radius: 0.5, 
  widthSegments:64, 
  heightSegments:32, 
  color: 0x00ff00,
  velocity:{
    x: 0,
    y: -0.01,
    z: 0
  },
  position:{
    x: 2,
    y: 0,
    z: 0
  }
});
sphere.castShadow = true;
// scene.add(sphere);

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

// KEYBOARD LISTENER

const keys={
  a:{
    isPressed: false,
  },
  d:{
    isPressed: false,
  },
  s:{
    isPressed: false,
  },
  w:{
    isPressed: false,
  }
}
window.addEventListener('keydown', (e)=>{
  switch(e.code){
    case 'KeyA':
      keys.a.isPressed = true
      break
    case 'KeyD':
      keys.d.isPressed = true
      break
    case 'KeyS':
      keys.s.isPressed = true
      break
    case 'KeyW':
      keys.w.isPressed = true
      break
  }
});

window.addEventListener('keyup', (e)=>{
  switch(e.code){
    case 'KeyA':
      keys.a.isPressed = false
      break
    case 'KeyD':
      keys.d.isPressed = false
      break
    case 'KeyS':
      keys.s.isPressed = false
      break
    case 'KeyW':
      keys.w.isPressed = false
      break
  }
});

const enemy = new Box({
  color: 'red',
  position:{
    x: 0,
    y: 0,
    z: -3,
  },
  velocity: {
    x: 0,
    y: -0.01,
    z: 0.005
  },
});
cube.castShadow = true;
scene.add(enemy);

const enemies = [enemy]

enemies.forEach(enemie => {
});

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // MOVEMENT CODE
  cube.velocity.x = 0;
  cube.velocity.z = 0;
  if(keys.a.isPressed){
    cube.velocity.x = -boxVelocity;
  }else if(keys.d.isPressed){
    cube.velocity.x = +boxVelocity;
  }
  if(keys.w.isPressed){
    cube.velocity.z = -boxVelocity;
  }else if(keys.s.isPressed){
    cube.velocity.z = +boxVelocity;
  }


  cube.update(ground);
  enemies.forEach(enemy => {
    enemy.update(ground);
  })
}
animate()