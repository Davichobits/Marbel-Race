import * as THREE from 'three';
import { boxCollision } from './boxCollision';

/**
 * Representa una caja en 3D utilizando Three.js.
 * Extiende la clase `THREE.Mesh` y crea un cubo con dimensiones y color personalizados.
 */
export class Box extends THREE.Mesh {
  /**
   * Crea una instancia de Box.
   * @param {Object} options - Opciones para la caja.
   * @param {number} options.width - Ancho de la caja.
   * @param {number} options.height - Alto de la caja.
   * @param {number} options.depth - Profundidad de la caja.
   * @param {number|string} options.color - Color de la caja (puede ser un valor hexadecimal o una cadena de color).
   */
  constructor({ 
    width = 1, 
    height = 1, 
    depth = 1, 
    color = '#00ff00', 
    velocity = {
      x: 0,
      y: 0,
      z: 0
    },
    position = {
      x: 0,
      y: 0,
      z: 0
    },
    zAcceleration = false,
  }) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color })
    );
    
    /** @type {number} */
    this.width = width;

    /** @type {number} */
    this.height = height;

    /** @type {number} */
    this.depth = depth;

    this.position.set(position.x, position.y, position.z);

    this.updateSides()

    this.velocity = velocity;
    this.gravity = -0.002;
    this.zAcceleration = zAcceleration;
  }
  /** @type {number} */

  /**
 * Actualiza las propiedades `bottom` y `top` en función de la posición y la altura.
 * `bottom` se establece en la coordenada Y menos la mitad de la altura.
 * `top` se establece en la coordenada Y más la mitad de la altura.
 *
 * @returns {void}
 */

  updateSides(){
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.left = this.position.x - this.width / 2;
    this.right = this.position.x + this.width / 2;
    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  }

  update(ground){
    this.updateSides()

    if(this.zAcceleration){
      this.velocity.z += 0.0001;
    }

    this.position.x += this.velocity.x
    this.position.z += this.velocity.z
    
    
    this.applyGravity(ground);
  }

  applyGravity(ground){
    this.velocity.y += this.gravity;

    const isCollition = boxCollision({
      box1: this,
      box2: ground,
    });
    if(isCollition){
      // collision
      this.velocity.y *= 0.8
      this.velocity.y = -this.velocity.y;
    }else {
      // fall
      this.position.y += this.velocity.y;
    }
    
  }
}