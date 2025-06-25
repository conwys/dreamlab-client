import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() textureSelected = new EventEmitter<Texture>();

  textures: Texture[] = [
    { src: 'assets/img/texture1.png', alt: 'Theme 1', wall: 'assets/img/paint.jpeg', floor: 'assets/img/carpet.jpg' },
    { src: 'assets/img/texture2.png', alt: 'Theme 2', wall: 'assets/img/brick.jpg', floor: 'assets/img/stone.jpg' },
    { src: 'assets/img/texture3.png', alt: 'Theme 3', wall: 'assets/img/wallpaper.jpg', floor: 'assets/img/wood.jpg' },
  ];
}
