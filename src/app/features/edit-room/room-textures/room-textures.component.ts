import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Texture } from '../../../models/texture';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-textures',
  imports: [CommonModule],
  templateUrl: './room-textures.component.html',
  styleUrl: './room-textures.component.scss',
  standalone: true,
})
export class RoomTexturesComponent {
  @Input() textures: Texture[] = [];
  @Output() textureSelected = new EventEmitter<number>();
}
