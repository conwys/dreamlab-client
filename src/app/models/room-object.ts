import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export class RoomObject {
  private _object: THREE.Object3D;

  private height: number; // Y-axis
  private length: number; // X-axis
  private width: number; // Z-axis

  public displayedInScene: boolean = false;

  constructor(
    mesh: THREE.Object3D,
    length: number,
    height: number,
    width: number
  ) {
    this._object = mesh;
    this.length = length;
    this.height = height;
    this.width = width;
  }

  get object(): THREE.Object3D {
    return this._object;
  }

  get position(): THREE.Vector3 {
    return this.object.position;
  }

  public addToScene(
    startPosition: { x: number; z: number },
    scene: THREE.Scene
  ): void {
    this.object.position.set(startPosition.x, this.height / 2, startPosition.z);

    scene.add(this.object);

    this.displayedInScene = true;
    this.object.visible = true;
  }

  public setTransformationLimits(
    controls: TransformControls,
    floorLength: number,
    floorWidth: number
  ): void {
    controls.minx = 0 + this.length / 2;
    controls.maxX = floorLength - this.length / 2;

    controls.minZ = 0 + this.width / 2;
    controls.maxZ = floorWidth - this.width / 2;
  }
}
