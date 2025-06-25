import * as THREE from 'three';

export type Texture = {
  src: string;
  alt: string;
  wall: THREE.Texture;
  floor: THREE.Texture;
};
