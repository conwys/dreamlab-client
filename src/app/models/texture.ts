import * as THREE from 'three';

export interface Texture {
  src: string;
  alt: string;
  wall: THREE.Texture;
  floor: THREE.Texture;
}
