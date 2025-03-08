import * as THREE from 'three';

export class Box extends THREE.Mesh{
  constructor({
    width,
    height,
    depth
  }){
    super(
      new THREE.BoxGeometry(width, height, depth), 
      new THREE.MeshStandardMaterial({color: 0x00ff00})
    );
    this.width = width;
    this.height = height;
    this.depth = depth;
  }
}