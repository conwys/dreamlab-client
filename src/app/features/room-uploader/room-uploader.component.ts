import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-uploader',
  imports: [CommonModule],
  templateUrl: './room-uploader.component.html',
  styleUrl: './room-uploader.component.scss',
  standalone: true
})
export class RoomUploaderComponent {
  wallImages: { [key: string]: string | null } = {
    north: null,
    south: null,
    east: null,
    west: null
  };

  selectedFiles: { [key: string]: File | null } = {
    north: null,
    south: null,
    east: null,
    west: null
  };

  onFileSelected(event: Event, wall: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles[wall] = input.files[0];
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.wallImages[wall] = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onUpload(): void {
    // Check if all walls have images
    const hasAllImages = Object.values(this.selectedFiles).every(file => file !== null);
    if (hasAllImages) {
      // Implement the file upload logic here
      console.log('Uploading files:', this.selectedFiles);
    } else {
      console.error('Please select images for all walls.');
    }
  }
}
