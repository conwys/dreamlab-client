import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import * as THREE from 'three';
import { RoomObject } from '../../models/room-object';
import { CommonModule } from '@angular/common';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

@Component({
  selector: 'app-object-selection-pane',
  imports: [CommonModule],
  templateUrl: './object-selection-pane.component.html',
  styleUrl: './object-selection-pane.component.scss',
})
export class ObjectSelectionPaneComponent implements AfterViewInit {
  @Output() selectObject = new EventEmitter<RoomObject>();
  @Output() removeObject = new EventEmitter<number>();

  objects: RoomObject[] = [];

  ngAfterViewInit(): void {
    // Test Objects
    const cylinderA = new RoomObject(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 1),
        new THREE.MeshPhongMaterial({ color: new THREE.Color('Red') })
      ),
      0.5,
      1,
      0.5
    );

    this.objects.push(cylinderA);

    const cylinderB = new RoomObject(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 1),
        new THREE.MeshPhongMaterial({ color: new THREE.Color('Green') })
      ),
      0.5,
      1,
      0.5
    );

    this.objects.push(cylinderB);

    this.loadObjectFromFile('assets/img/white_mesh.glb');
  }

  private loadObjectFromFile(fileUrl: string): void {
    const loader = new GLTFLoader();

    loader.load(
      fileUrl,
      // called when the resource is loaded
      (gltf) => {
        const newObject = gltf.scene.children[0];

        const objectSize = new THREE.Vector3();
        new THREE.Box3().setFromObject(newObject).getSize(objectSize);

        this.objects.push(
          new RoomObject(newObject, objectSize.x, objectSize.y, objectSize.z)
        );
      },
      // called while loading is progressing
      () => {},
      // called when loading has errors
      function (error) {
        console.log('An error occured loading the model');
      }
    );
  }
}
