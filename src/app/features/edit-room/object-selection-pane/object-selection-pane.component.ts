import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import { RoomObject } from '../../../models/room-object';
import { CommonModule } from '@angular/common';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ColorPickerModule } from 'ngx-color-picker';
import { BackendServiceService } from '../../../services/backend-service.service';
import {
  faPlus,
  faTrash,
  faUpDownLeftRight,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-object-selection-pane',
  imports: [CommonModule, ColorPickerModule, FontAwesomeModule],
  templateUrl: './object-selection-pane.component.html',
  styleUrl: './object-selection-pane.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ObjectSelectionPaneComponent implements AfterViewInit {
  @Output() addObject = new EventEmitter<RoomObject>();
  @Output() removeObject = new EventEmitter<number>();

  @Output() selectObjectToTransform = new EventEmitter<RoomObject>();
  @Output() rotateObject = new EventEmitter<RoomObject>();

  faPlus = faPlus;
  faTrash = faTrash;
  faUpDownLeftRight = faUpDownLeftRight;
  faRotate = faRotate;

  objectsCurrentlyInRoom: RoomObject[] = [];

  constructor(private backendService: BackendServiceService) {}

  async ngAfterViewInit(): Promise<void> {
    await import('@google/model-viewer');

    const fetchedModels = await this.backendService.getSessionModels();

    fetchedModels.forEach((url) => {
      this.loadObjectFromFile(url);
    });
    // this.loadObjectFromFile('assets/img/white_mesh.glb');
  }

  private loadObjectFromFile(fileUrl: string): void {
    const loader = new GLTFLoader();

    loader.load(
      fileUrl,
      // called when the resource is loaded
      (gltf) => {
        const newObject = gltf.scene.children[0].children[0];

        const objectSize = new THREE.Vector3();
        new THREE.Box3().setFromObject(newObject).getSize(objectSize);

        this.objectsCurrentlyInRoom.push(
          new RoomObject(
            newObject as THREE.Mesh,
            objectSize.x,
            objectSize.y,
            objectSize.z,
            fileUrl
          )
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
