import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { BackendServiceService } from '../../../services/backend-service.service';
import {
  faPlus,
  faTrash,
  faImage,
  faArrowRight,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faExclamationCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

interface ObjectUpload {
  id: number;
  caption: string;
  images: (File | null)[];
  thumbnails: (string | null)[];
  isExpanded: boolean;
}

const IMAGE_LABELS = ['Front', 'Left', 'Right', 'Back'];

@Component({
  selector: 'app-add-objects-modal',
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './add-objects-modal.component.html',
  styleUrl: './add-objects-modal.component.scss',
  standalone: true,
})
export class AddObjectsModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() objectsAdded = new EventEmitter<void>();

  isLoading = false;
  errorMessage: string | null = null;
  isClosing = false;

  faPlus = faPlus;
  faTrash = faTrash;
  faImage = faImage;
  faArrowRight = faArrowRight;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faExclamationCircle = faExclamationCircle;
  faTimes = faTimes;

  imageLabels = IMAGE_LABELS;
  objects: ObjectUpload[] = [
    {
      id: 0,
      caption: '',
      images: [null, null, null, null],
      thumbnails: [null, null, null, null],
      isExpanded: true,
    },
  ];
  lastId = 0;

  currentPage = 1;
  itemsPerPage = 2;

  constructor(private backendService: BackendServiceService) {}

  get totalPages(): number {
    return Math.ceil(this.objects.length / this.itemsPerPage);
  }

  get paginatedObjects(): ObjectUpload[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.objects.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onFileSelected(event: Event, objectId: number, imageIndex: number): void {
    const input = event.target as HTMLInputElement;
    const object = this.objects.find((o) => o.id === objectId);

    if (!object || !input.files) return;

    const file = input.files[0];
    object.images[imageIndex] = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (object) {
        object.thumbnails[imageIndex] = e.target?.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  addNewObject(): void {
    this.objects.forEach((obj) => (obj.isExpanded = false));

    this.lastId++;
    this.objects.push({
      id: this.lastId,
      caption: '',
      images: [null, null, null, null],
      thumbnails: [null, null, null, null],
      isExpanded: true,
    });

    const newTotalPages = Math.ceil(this.objects.length / this.itemsPerPage);
    if (newTotalPages > this.currentPage) {
      this.currentPage = newTotalPages;
    }
  }

  toggleObject(id: number): void {
    const object = this.objects.find((o) => o.id === id);
    if (object) {
      object.isExpanded = !object.isExpanded;
    }
  }

  removeObject(id: number): void {
    const currentPageObjects = this.paginatedObjects;

    this.objects = this.objects.filter((o) => o.id !== id);

    if (currentPageObjects.length === 1 && this.currentPage > 1) {
      this.currentPage--;
    } else if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
  }

  removeImage(objectId: number, imageIndex: number): void {
    const object = this.objects.find((o) => o.id === objectId);
    if (!object) return;

    object.images[imageIndex] = null;
    object.thumbnails[imageIndex] = null;
  }

  dismissError(): void {
    this.errorMessage = null;
  }

  close(): void {
    this.isClosing = true;
    setTimeout(() => {
      this.isClosing = false;
      this.closeModal.emit();
    }, 200);
  }

  onModalBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  async onAddObjects(): Promise<void> {
    const isValid = this.objects.every((obj) => obj.images[0] !== null && obj.caption.trim().length > 0);

    if (!isValid) {
      alert('Please ensure each object has at least a front image and a caption');
      return;
    }

    try {
      this.isLoading = true;
      await Promise.all(
        this.objects.map((obj) => {
          const images = {
            front: obj.images[0] || undefined,
            left: obj.images[1] || undefined,
            right: obj.images[2] || undefined,
            back: obj.images[3] || undefined,
          };
          return this.backendService.processFurnitureImages(images, obj.caption);
        }),
      );
      console.log('Objects uploaded:', this.objects);
      this.objectsAdded.emit();
      this.resetModal();
      this.close();
    } catch (error) {
      this.errorMessage = 'Error uploading objects: ' + (error instanceof Error ? error.message : String(error));
    } finally {
      this.isLoading = false;
    }
  }

  resetModal(): void {
    this.objects = [
      {
        id: 0,
        caption: '',
        images: [null, null, null, null],
        thumbnails: [null, null, null, null],
        isExpanded: true,
      },
    ];
    this.lastId = 0;
    this.currentPage = 1;
    this.errorMessage = null;
    this.isLoading = false;
  }
}
