import * as THREE from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';

export class RoomObject {
  private _object: THREE.Object3D;

  private height: number; // Y-axis
  private length: number; // X-axis
  private width: number; // Z-azids

  private _dragControls?: DragControls;

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

  get dragControls(): DragControls | undefined {
    return this._dragControls;
  }

  public addToScene(
    startPosition: { x: number; z: number },
    scene: THREE.Scene
  ): void {
    this.object.position.set(startPosition.x, this.height / 2, startPosition.z);

    scene.add(this.object);
  }

  public setUpDragControls(
    camera: THREE.Camera,
    domElement: HTMLElement
  ): void {
    this._dragControls = new DragControls([this.object], camera, domElement);
  }

  public repositionWithinBounds(floorLength: number, floorWidth: number): void {
    this.position.y = this.height / 2;

    if (this.position.x + this.length / 2 > floorLength) {
      this.position.x = floorLength - this.length / 2;
    }
    if (this.position.x - this.length / 2 < 0) {
      this.position.x = 0 + this.length / 2;
    }

    if (this.position.z + this.width / 2 > floorWidth) {
      this.position.z = floorWidth - this.width / 2;
    }
    if (this.position.z - this.width / 2 < 0) {
      this.position.z = 0 + this.width / 2;
    }
  }
}
