export interface ObjectUpload {
  id: number;
  caption: string;
  images: (File | null)[];
  thumbnails: (string | null)[];
  isExpanded: boolean;
}
