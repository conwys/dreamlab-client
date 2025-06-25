import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-room-textures',
  templateUrl: './room-textures.component.html',
  styleUrl: './room-textures.component.scss',
  standalone: true,
})
export class RoomTexturesComponent {
  textures = [
    { src: 'assets/img/texture1.png', alt: 'Theme 1', value: 'texture1' },
    { src: 'assets/img/texture2.png', alt: 'Theme 2', value: 'texture2' },
    { src: 'assets/img/texture3.png', alt: 'Theme 3', value: 'texture3' },
  ];

  @Output() textureSelected = new EventEmitter<string>();

  selectTexture(texture: string) {
    this.textureSelected.emit(texture);
  }
}
