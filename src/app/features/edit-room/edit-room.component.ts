import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ObjectSelectionPaneComponent } from './object-selection-pane/object-selection-pane.component';
import { RoomObject } from '../../models/room-object';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { RoomSizingComponent } from './room-sizing/room-sizing.component';

@Component({
  selector: 'app-edit-room',
  imports: [ObjectSelectionPaneComponent, RoomSizingComponent],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.scss',
  standalone: true,
})
export class EditRoomComponent implements AfterViewInit, OnDestroy {
  private canvas?: HTMLElement | null;
  private renderer = new THREE.WebGLRenderer();
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();

  private roomLength = 6; // X -axis
  private roomHeight = 6; // Y-axis
  private roomWidth = 6; // Z-axis

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

  ngOnDestroy(): void {
    this.renderer?.setAnimationLoop(null);
  }

  ngAfterViewInit(): void {
    if (typeof document !== 'undefined') {
      this.canvas = document.getElementById('edit-room-canvas');
    }

    if (this.canvas) {
      const canvas = this.canvas;

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        alpha: true,
      });

      this.camera = new THREE.PerspectiveCamera(
        75,
        this.canvas.clientWidth / this.canvas.clientHeight,
        0.1,
        1000
      );

      this.camera.position.set(10, 6, 10);

      // Create a light
      const light = new THREE.DirectionalLight(new THREE.Color(), 3);
      light.position.set(6, 10, 10);
      this.scene.add(light);

      this.setUpRoomDimensions();

      this.scene?.add(this.xyPlane as THREE.Object3D);
      this.scene?.add(this.zyPlane as THREE.Object3D);
      this.scene?.add(this.xzPlane as THREE.Object3D);

      this.setUpOrbitControls();

      this.renderer.setAnimationLoop(() => {
        if (this.renderer && this.camera && this.scene) {
          // Maintain the aspect ratio of the view when canvas is resized
          if (this.resizeRendererToDisplaySize()) {
            const canvas = this.renderer.domElement;

            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
          }

          this.renderer.render(this.scene, this.camera);
        }
      });
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
    const x = this.roomLength;
    const y = this.roomHeight;
    const z = this.roomWidth;

    this.xyPlane = new THREE.Mesh(new THREE.PlaneGeometry(x, y), this.wallMaterial);
    this.xyPlane.translateX(x / 2).translateY(y / 2);

    this.zyPlane = new THREE.Mesh(new THREE.PlaneGeometry(z, y), this.wallMaterial);
    this.zyPlane
      .translateZ(z / 2)
      .translateY(y / 2)
      .rotateY(this.degToRad(90));

    this.xzPlane = new THREE.Mesh(new THREE.PlaneGeometry(x, z), this.floorMaterial);
    this.xzPlane
      .translateX(x / 2)
      .translateZ(z / 2)
      .rotateX(this.degToRad(90));
  }

  private setUpOrbitControls(): void {
    this.orbitControls = new OrbitControls(this.camera, this.canvas);
    this.orbitControls.target.set(0, 0, 0);
    // this.orbitControls.enablePan = false;
    // this.orbitControls.maxDistance = 20;
    // this.orbitControls.minDistance = 5;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
    this.orbitControls.maxAzimuthAngle = Math.PI / 2;
    this.orbitControls.minAzimuthAngle = 0;
    this.orbitControls.update();
  }

  private setUpTransformControls(): void {
    this.transformControls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );

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

  public attachObjectToTransformControls(
    roomObject: RoomObject,
    rotate: boolean = false
  ): void {
    const isCurrentlyAttached =
      this.transformControls?.object?.id == roomObject.object.id;

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

      roomObject.setTransformationLimits(
        this.transformControls,
        this.roomLength,
        this.roomWidth
      );
    }
  }

  public rotateObjectInRoom(object: RoomObject): void {
    object.object.rotateY(this.degToRad(90));
    object.updateDimensionsOnYRotation();

    this.attachObjectToTransformControls(object, true);
  }

  protected updateRoomLength(newLength: number): void {
    this.roomLength = newLength;

    this.setUpRoomDimensions();
  }

  protected updateRoomWidth(newWidth: number): void {
    this.roomWidth = newWidth;

    this.setUpRoomDimensions();
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180.0);
  }
}
