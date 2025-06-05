import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ObjectSelectionPaneComponent } from '../object-selection-pane/object-selection-pane.component';
import { RoomObject } from '../../models/room-object';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

@Component({
  selector: 'app-edit-room',
  imports: [ObjectSelectionPaneComponent],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.scss',
  standalone: true,
})
export class EditRoomComponent implements AfterViewInit, OnDestroy {
  private canvas?: HTMLElement | null;
  private renderer = new THREE.WebGLRenderer();
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();

  private roomLength = 3; // X -axis
  private roomHeight = 3; // Y-axis
  private roomWidth = 3; // Z-axis

  private dragControls?: DragControls;
  private orbitControls?: OrbitControls;

  private objectsWithinRoom: RoomObject[] = [];

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

      this.camera.position.set(5, 3, 5);

      // Create a light
      const light = new THREE.DirectionalLight(new THREE.Color(), 3);
      light.position.set(3, 5, 5);
      this.scene.add(light);

      this.setUpRoomDimensions();

      this.setUpDragControls();
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

  addObjectToRoom(object: RoomObject): void {
    const floorCentre = {
      x: this.roomLength / 2,
      z: this.roomWidth / 2,
    };

    object.addToScene(floorCentre, this.scene);

    this.objectsWithinRoom.push(object);

    this.setUpDragControls();
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

    const wallMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color('Cornsilk'),
      side: THREE.DoubleSide,
    });

    const floorMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color('Sienna'),
      side: THREE.DoubleSide,
    });

    const xyPlane = new THREE.Mesh(new THREE.PlaneGeometry(x, y), wallMaterial);
    xyPlane.translateX(x / 2).translateY(y / 2);
    this.scene?.add(xyPlane);

    const zyPlane = new THREE.Mesh(new THREE.PlaneGeometry(z, y), wallMaterial);
    zyPlane
      .translateZ(z / 2)
      .translateY(y / 2)
      .rotateY(this.degToRad(90));
    this.scene?.add(zyPlane);

    const xzPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(x, z),
      floorMaterial
    );
    xzPlane
      .translateX(x / 2)
      .translateZ(z / 2)
      .rotateX(this.degToRad(90));
    this.scene?.add(xzPlane);
  }

  private setUpOrbitControls(): void {
    this.orbitControls = new OrbitControls(this.camera, this.canvas);
    this.orbitControls.target.set(0, 0, 0);
    this.orbitControls.enablePan = false;
    this.orbitControls.maxDistance = 10;
    this.orbitControls.minDistance = 5;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
    this.orbitControls.maxAzimuthAngle = Math.PI / 2;
    this.orbitControls.minAzimuthAngle = 0;
    this.orbitControls.update();
  }

  private setUpDragControls(): void {
    this.dragControls = new DragControls(
      this.objectsWithinRoom.map((roomObject) => roomObject.object),
      this.camera,
      this.renderer.domElement
    );

    this.dragControls.addEventListener('dragstart', () => {
      if (this.orbitControls) {
        this.orbitControls.enabled = false;
      }
    });

    this.dragControls.addEventListener('drag', (event) => {
      this.objectsWithinRoom.forEach((roomObject) => {
        if (event.object == roomObject.object) {
          roomObject.repositionWithinBounds(this.roomLength, this.roomWidth);
        }
      });
    });

    this.dragControls.addEventListener('dragend', () => {
      if (this.orbitControls) {
        this.orbitControls.enabled = true;
      }
    });
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180.0);
  }
}
