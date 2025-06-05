import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import * as THREE from 'three';
import { RoomObject } from '../../models/room-object';
import { CommonModule } from '@angular/common';

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
  }
}
