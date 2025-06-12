import { Injectable } from '@angular/core';

const BASE_API_URL = process.env['BASE_API_URL'] || '';


@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {
  public sessionId: string | null = null;

  // Constructor generates a session ID.
  constructor() {
    (async () => {
      try {
        this.sessionId = await this.generateSessionId();
      } catch {
        this.sessionId = null;
      }
    })();
  }


  // Generate a session ID for the user when the page loads.
  // Session IDs expire after 1hr.
  async generateSessionId(): Promise<string> {
    const response = await fetch(`${BASE_API_URL}/api/generate_session_id`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to generate session ID');
    }
    const data = await response.json();
    return data.session_id;
  }


  // Send 1-4 images to the backend for processing.
  // At least a 'front' image is always required.
  async processFurnitureImages(
    images: { front?: File; left?: File; right?: File; back?: File }
  ): Promise<{ message: string; session_id: string; filename: string; model_url?: string }> {
    if (!this.sessionId) {
      throw new Error('Session ID not set.');
    }
    if (!images.front) {
      throw new Error('The front image is required.');
    }
    const formData = new FormData();
    formData.append('front', images.front);
    if (images.left) formData.append('left', images.left);
    if (images.right) formData.append('right', images.right);
    if (images.back) formData.append('back', images.back);

    const response = await fetch(`${BASE_API_URL}/api/process_furniture_image/${this.sessionId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to process furniture images');
    }

    return await response.json();
  }


  // Service to get list of model file names.
  async getSessionModels(): Promise<{ session_id: string; models: string[] }> {
    if (!this.sessionId) {
      throw new Error('Session ID not set.');
    }
    const response = await fetch(`${BASE_API_URL}/api/session_models/${this.sessionId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch session models');
    }

    return await response.json();
  }


  // Service to get individual model files.
  async fetchModelFile(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch model file');
    }
    return await response.blob();
  }
}
