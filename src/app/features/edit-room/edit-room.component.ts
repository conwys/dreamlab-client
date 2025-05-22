import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ObjectSelectionPaneComponent } from '../object-selection-pane/object-selection-pane.component';

@Component({
  selector: 'app-edit-room',
  imports: [ObjectSelectionPaneComponent],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.scss',
  standalone: true,
})
export class EditRoomComponent implements AfterViewInit, OnDestroy {
  private canvas?: HTMLElement | null;
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;

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
      console.log(this.renderer);

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(
        75,
        this.canvas.clientWidth / this.canvas.clientHeight,
        0.1,
        1000
      );

      this.camera.position.x = 5;
      this.camera.position.y = 3;
      this.camera.position.z = 5;

      const geometary = new THREE.PlaneGeometry(3, 3);

      const wallMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color('Cornsilk'),
        side: THREE.DoubleSide,
      });

      const floorMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color('Sienna'),
        side: THREE.DoubleSide,
      });

      const xyPlane = new THREE.Mesh(geometary, wallMaterial);
      xyPlane.translateX(1.5).translateY(1.5);
      this.scene.add(xyPlane);

      const zyPlane = new THREE.Mesh(geometary, wallMaterial);
      zyPlane.translateZ(1.5).translateY(1.5).rotateY(this.degToRad(90));
      this.scene.add(zyPlane);

      const xzPlane = new THREE.Mesh(geometary, floorMaterial);
      xzPlane.translateX(1.5).translateZ(1.5).rotateX(this.degToRad(90));
      this.scene.add(xzPlane);

      // Create a light
      const light = new THREE.DirectionalLight(new THREE.Color(), 3);
      light.position.set(3, 5, 5);
      this.scene.add(light);

      const controls = new OrbitControls(this.camera, canvas);
      controls.target.set(0, 0, 0);
      controls.enablePan = false;
      controls.maxDistance = 10;
      controls.minDistance = 5;
      controls.maxPolarAngle = Math.PI / 2;
      controls.maxAzimuthAngle = Math.PI / 2;
      controls.minAzimuthAngle = 0;
      controls.update();

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

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180.0);
  }
}
