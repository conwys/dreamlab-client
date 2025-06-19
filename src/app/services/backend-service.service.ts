import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {
  public sessionId: string | null = null;

  api_url = import.meta.env['NG_APP_BASE_API_URL'] || 'http://localhost:5000';

  // Constructor generates a session ID.
  constructor() {
    (async () => {
      try {
        this.sessionId = await this.generateSessionId();
      } catch (err) {
        this.sessionId = null;
      }
    })();
  }
  

  // Generate a session ID for the user when the page loads.
  // Session IDs expire after 1hr.
  async generateSessionId(): Promise<string> {
    const response = await fetch(`${this.api_url}/api/generate_session_id`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to generate session ID');
    }
    const data = await response.json();
    console.log('Generated session ID:', data.session_id);
    return data.session_id;
  }


  // Send 1-4 images to the backend for processing.
  // At least a 'front' image is always required.
  async processFurnitureImages(
    images: { front?: File; left?: File; right?: File; back?: File },
    caption?: string
  ): Promise<{ message: string; session_id: string; filename: string; model_url?: string }> {
    if (!this.sessionId) {
      throw new Error('Session ID not set.');
    }
    if (!images.front) {
      throw new Error('The front image is required.');
    }
    const formData = new FormData();
    if (images.front) formData.append('front_image', images.front);
    if (images.left) formData.append('left_image', images.left);
    if (images.right) formData.append('right_image', images.right);
    if (images.back) formData.append('back_image', images.back);
    if (caption) formData.append('caption', caption);

    const response = await fetch(`${this.api_url}/api/process_furniture_image/${this.sessionId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to process furniture images');
    }

    return await response.json();
  }


  // Service to get list of model file names as URLs.
  async getSessionModels(): Promise<string[]> {
    if (!this.sessionId) {
      throw new Error('Session ID not set.');
    }
    const response = await fetch(`${this.api_url}/api/session_models/${this.sessionId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch session models');
    }

    const data = await response.json();
    // Convert file names to URLs
    const models = (data.models || []).map(
      (fileName: string) =>
        `${this.api_url}/sessions/${this.sessionId}/models/${fileName}`
    );
    return models;
  }
}
