import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export class RoomObject {
  private _object: THREE.Mesh;
  private _colour?: string;

  private defaultColour = 'rgb(255,255,255)';

  private height: number; // Y-axis
  private length: number; // X-axis
  private width: number; // Z-axis

  public filePath?: string;
  public displayedInScene = false;

  constructor(mesh: THREE.Mesh, length: number, height: number, width: number, filePath?: string) {
    this._object = mesh;

    this.length = length;
    this.height = height;
    this.width = width;

    this.filePath = filePath ? filePath : undefined;

    this.colour = this.defaultColour;
  }

  get object(): THREE.Mesh {
    return this._object;
  }

  get position(): THREE.Vector3 {
    return this.object.position;
  }

  get colour(): string {
    return this._colour || this.defaultColour;
  }

  set colour(newColor: string) {
    this._colour = newColor;

    if (Array.isArray(this.object.material)) {
      (this.object.material[0] as THREE.MeshStandardMaterial).color = new THREE.Color(newColor);
    } else {
      (this.object.material as THREE.MeshStandardMaterial).color = new THREE.Color(newColor);
    }
  }

  public addToScene(startPosition: { x: number; z: number }, scene: THREE.Scene): void {
    this.object.position.set(startPosition.x, this.height / 2, startPosition.z);

    scene.add(this.object);

    this.displayedInScene = true;
    this.object.visible = true;
  }

  public setTransformationLimits(controls: TransformControls, floorLength: number, floorWidth: number): void {
    const minX = 0 + this.length / 2;
    const maxX = floorLength - this.length / 2;
    const minZ = 0 + this.width / 2;
    const maxZ = floorWidth - this.width / 2;

    const object = this.object;

    controls.addEventListener('objectChange', () => {
      object.position.x = Math.max(minX, Math.min(maxX, object.position.x));
      object.position.z = Math.max(minZ, Math.min(maxZ, object.position.z));
    });
  }

  public updateDimensionsOnYRotation(): void {
    const inialLength = this.length;
    const initialWidth = this.width;

    this.length = initialWidth;
    this.width = inialLength;
  }
}
