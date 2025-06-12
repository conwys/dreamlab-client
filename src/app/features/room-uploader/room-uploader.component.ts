import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-room-uploader',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './room-uploader.component.html',
  styleUrl: './room-uploader.component.scss',
  standalone: true,
})
export class RoomUploaderComponent {
  faNorth = faArrowUp;
  faSouth = faArrowDown;
  faEast = faArrowRight;
  faWest = faArrowLeft;

  wallImages: { [key: string]: string | null } = {
    north: null,
    south: null,
    east: null,
    west: null,
  };

  selectedFiles: { [key: string]: File | null } = {
    north: null,
    south: null,
    east: null,
    west: null,
  };

  onFileSelected(event: Event, wall: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFiles[wall] = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.wallImages[wall] = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onUpload(): void {
    const hasAllImages = Object.values(this.selectedFiles).every(
      (file) => file !== null
    );
    if (hasAllImages) {
      // Implement file upload logic here
      console.log('Uploading files:', this.selectedFiles);
    } else {
      console.error('Please select images for all walls.');
    }
  }
}
