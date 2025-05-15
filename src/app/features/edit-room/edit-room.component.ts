import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Component({
  selector: 'app-edit-room',
  imports: [],
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
    this.canvas = document.getElementById('edit-room-canvas');

    if (this.canvas) {
      const canvas = this.canvas;
      this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
      console.log(this.renderer);

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(
        75,
        this.canvas.clientWidth / this.canvas.clientHeight,
        0.1,
        1000
      );

      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

      const greenMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0, 1, 0),
      });

      const greenCube = new THREE.Mesh(cubeGeometry, greenMaterial);

      this.scene.add(greenCube);

      this.camera.position.z = 7;

      // Create a light
      const light = new THREE.DirectionalLight(new THREE.Color(), 3);
      light.position.set(-1, 2, 4);
      this.scene.add(light);

      const controls = new OrbitControls(this.camera, canvas);
      controls.target.set(0, 0, 0);
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
}
