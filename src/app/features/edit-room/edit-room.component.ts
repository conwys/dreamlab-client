import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ObjectSelectionPaneComponent } from './object-selection-pane/object-selection-pane.component';
import { RoomObject } from '../../models/room-object';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { RoomSizingComponent } from './room-sizing/room-sizing.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-room',
  imports: [ObjectSelectionPaneComponent, RoomSizingComponent, FontAwesomeModule],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.scss',
  standalone: true,
})
export class EditRoomComponent implements AfterViewInit, OnDestroy {
  private canvas?: HTMLCanvasElement | null;
  private renderer = new THREE.WebGLRenderer();
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();

  protected readonly initialValue = 5;

  private roomLength = this.initialValue; // X -axis
  private roomHeight = this.initialValue; // Y-axis
  private roomWidth = this.initialValue; // Z-axis

  private xyPlane?: THREE.Mesh;
  private zyPlane?: THREE.Mesh;
  private xzPlane?: THREE.Mesh;

  private orbitControls?: OrbitControls;
  private transformControls?: TransformControls;

  private objectsWithinRoom: RoomObject[] = [];

  private wallMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color('Cornsilk'),
    side: THREE.DoubleSide,
  });

  private floorMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color('Sienna'),
    side: THREE.DoubleSide,
  });

  private wallThickness = 0.2;

  faCamera = faCamera;

  ngOnDestroy(): void {
    this.renderer?.setAnimationLoop(null);
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      this.canvas = document.getElementById('edit-room-canvas') as HTMLCanvasElement;
    }

    if (this.canvas) {
      const canvas = this.canvas;

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
      });

      this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);

      this.camera.position.set(10, 6, 10);

      // Create a light
      const light = new THREE.DirectionalLight(new THREE.Color(), 3);
      light.position.set(6, 10, 10);
      this.scene.add(light);

      this.setUpRoomDimensions();

      this.setUpOrbitControls();

      this.renderer.setAnimationLoop(() => {
        this.render();
      });
    }
  }

  private render(): void {
    if (this.renderer && this.camera && this.scene) {
      // Maintain the aspect ratio of the view when canvas is resized
      if (this.resizeRendererToDisplaySize()) {
        const canvas = this.renderer.domElement;

        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  addObjectToRoom(roomObject: RoomObject): void {
    const floorCentre = {
      x: this.roomLength / 2,
      z: this.roomWidth / 2,
    };

    roomObject.addToScene(floorCentre, this.scene);

    this.objectsWithinRoom.push(roomObject);
  }

  removeObjectFromRoom(id: number): void {
    const object = this.scene.getObjectById(id);

    if (object) {
      this.scene.remove(object);
    }

    this.objectsWithinRoom.filter((obj) => {
      if (obj.object.id == id) {
        obj.displayedInScene = false;
        obj.object.visible = false;

        return false;
      }

      return true;
    });

    if (this.transformControls?.object?.id == id) {
      this.transformControls?.detach();
    }
  }

  private resizeRendererToDisplaySize() {
    if (this.renderer) {
      const canvas = this.renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        this.renderer.setSize(width, height, false);
      }

      return needResize;
    }

    return false;
  }

  private setUpRoomDimensions(): void {
    if (this.xyPlane) {
      this.scene?.remove(this.xyPlane);
    }
    if (this.zyPlane) {
      this.scene?.remove(this.zyPlane);
    }
    if (this.xzPlane) {
      this.scene?.remove(this.xzPlane);
    }

    const x = this.roomLength;
    const y = this.roomHeight;
    const z = this.roomWidth;

    this.xyPlane = new THREE.Mesh(new THREE.BoxGeometry(x, y, this.wallThickness), this.wallMaterial);
    this.xyPlane.translateX(x / 2).translateY(y / 2);
    this.scene?.add(this.xyPlane);

    this.zyPlane = new THREE.Mesh(new THREE.BoxGeometry(this.wallThickness, y, z), this.wallMaterial);
    this.zyPlane.translateZ(z / 2).translateY(y / 2);
    this.scene?.add(this.zyPlane);

    this.xzPlane = new THREE.Mesh(new THREE.BoxGeometry(x, this.wallThickness, z), this.floorMaterial);
    this.xzPlane.translateX(x / 2).translateZ(z / 2);
    this.scene?.add(this.xzPlane);
  }

  private setUpOrbitControls(): void {
    this.orbitControls = new OrbitControls(this.camera, this.canvas);
    this.orbitControls.target.set(0, 0, 0);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.5;
    this.orbitControls.rotateSpeed = 0.3;
    this.orbitControls.update();
  }

  private setUpTransformControls(): void {
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);

    this.scene.add(this.transformControls.getHelper());

    this.transformControls.addEventListener('mouseDown', () => {
      if (this.orbitControls) {
        this.orbitControls.enabled = false;
      }
    });

    this.transformControls.addEventListener('mouseUp', () => {
      if (this.orbitControls) {
        this.orbitControls.enabled = true;
      }
    });

    this.transformControls.showY = false;
    this.transformControls.setSize(0.5);
  }

  public attachObjectToTransformControls(roomObject: RoomObject, rotate = false): void {
    const isCurrentlyAttached = this.transformControls?.object?.id == roomObject.object.id;

    if (!isCurrentlyAttached && rotate) {
      return;
    }

    this.transformControls?.detach().dispose();

    if (isCurrentlyAttached && !rotate) {
      return;
    }

    this.setUpTransformControls();

    if (roomObject.displayedInScene && this.transformControls) {
      this.transformControls?.attach(roomObject.object);

      roomObject.setTransformationLimits(this.transformControls, this.roomLength, this.roomWidth);
    }
  }

  public rotateObjectInRoom(object: RoomObject): void {
    object.object.rotateY(this.degToRad(90));
    object.updateDimensionsOnYRotation();

    this.attachObjectToTransformControls(object, true);
  }

  protected updateRoomDimension(newDimension: number, dimension: Dimensions): void {
    switch (dimension) {
      case 'length':
        this.roomLength = newDimension;
        break;
      case 'width':
        this.roomWidth = newDimension;
        break;
      case 'height':
        this.roomHeight = newDimension;
        break;
    }

    this.setUpRoomDimensions();

    if (this.transformControls?.object) {
      this.transformControls.detach();
    }
  }

  protected captureScreenshot(): void {
    this.render();
    this.canvas?.toBlob((blob) => {
      this.saveBlob(blob as Blob, 'dreamlab-screencapture.png');
    });
  }

  private saveBlob(blob: Blob, fileName: string) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180.0);
  }
}

type Dimensions = 'length' | 'width' | 'height';
