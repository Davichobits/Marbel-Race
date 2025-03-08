import * as THREE from 'three';

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
  constructor({ width, height, depth, color }) {
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

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
  }
  /** @type {number} */

  /** @type {number} */
  update(){
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
  }
}