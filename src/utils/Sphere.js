import * as THREE from 'three';

/**
 * Representa una esfera en 3D utilizando Three.js
 */
export class Sphere extends THREE.Mesh{
  constructor({
    radius, 
    widthSegments, 
    heightSegments, 
    color='#00ff00',
    velocity = {
      x:0,
      y:0,
      z:0,
    },
    position = {
      x:0,
      y:0,
      z:0,
    }}
  ){
    super(
      new THREE.SphereGeometry(radius,widthSegments,heightSegments),
      new THREE.MeshStandardMaterial({color})
    )
    this.position.set(position.x, position.y, position.z);

    this.radius = radius;

    this.bottom = this.position.y - this.radius; 
    this.top = this.position.y + this.radius;
    
    this.velocity = velocity;
    this.gravity = -0.002;
  }
  
  update(ground){
    this.bottom = this.position.y - this.radius; 
    this.top = this.position.y + this.radius;
    
    this.velocity.y += this.gravity;


    if(this.bottom + this.velocity.y <= ground.top){
      this.velocity.y = -this.velocity.y;
    } else{
      this.position.y += this.velocity.y;
    }
  }
}