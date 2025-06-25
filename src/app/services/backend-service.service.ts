import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BackendServiceService {
  public sessionId: string | null = null;
  private readonly SESSION_STORAGE_KEY = 'dreamlab_session';
  private readonly SESSION_EXPIRY_KEY = 'dreamlab_session_expiry';
  private readonly SESSION_DURATION_MS = 60 * 60 * 1000;

  api_url = environment.BASE_API_URL;

  // Constructor gets or generates a session ID
  constructor() {
    (async () => {
      try {
        this.sessionId = await this.getOrCreateSession();
      } catch (err) {
        console.error('Failed to initialize session:', err);
        this.sessionId = null;
      }
    })();
  }

  private async getOrCreateSession(): Promise<string> {
    const storedSessionId = localStorage.getItem(this.SESSION_STORAGE_KEY);
    const storedExpiry = localStorage.getItem(this.SESSION_EXPIRY_KEY);

    // Check if we have a valid session that hasn't expired
    if (storedSessionId && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const currentTime = Date.now();

      if (currentTime < expiryTime) {
        console.log('Using existing session ID:', storedSessionId);
        return storedSessionId;
      } else {
        console.log('Session expired, generating new one');
        this.clearStoredSession();
      }
    }

    const newSessionId = await this.generateSessionId();
    this.storeSession(newSessionId);
    return newSessionId;
  }

  // Store session ID and expiry time in localStorage
  private storeSession(sessionId: string): void {
    const expiryTime = Date.now() + this.SESSION_DURATION_MS;
    localStorage.setItem(this.SESSION_STORAGE_KEY, sessionId);
    localStorage.setItem(this.SESSION_EXPIRY_KEY, expiryTime.toString());
    console.log('Session stored. Expires at:', new Date(expiryTime).toLocaleString());
  }

  // Clear stored session data
  private clearStoredSession(): void {
    localStorage.removeItem(this.SESSION_STORAGE_KEY);
    localStorage.removeItem(this.SESSION_EXPIRY_KEY);
  }

  // Check if current session is still valid
  public isSessionValid(): boolean {
    const storedExpiry = localStorage.getItem(this.SESSION_EXPIRY_KEY);
    if (!storedExpiry || !this.sessionId) {
      return false;
    }
    return Date.now() < parseInt(storedExpiry, 10);
  }

  // Refresh session if it's about to expire (within 5 minutes)
  public async refreshSessionIfNeeded(): Promise<void> {
    const storedExpiry = localStorage.getItem(this.SESSION_EXPIRY_KEY);
    if (!storedExpiry) return;

    const expiryTime = parseInt(storedExpiry, 10);
    const currentTime = Date.now();
    const fiveMinutesMs = 5 * 60 * 1000;

    // If session expires in less than 5 minutes, refresh it
    if (expiryTime - currentTime < fiveMinutesMs) {
      console.log('Session expiring soon, refreshing...');
      this.sessionId = await this.getOrCreateSession();
    }
  }

  // Generate a session ID for the user when the page loads.
  // Session IDs expire after 1hr.
  async generateSessionId(): Promise<string> {
    const response = await fetch(`${this.api_url}/api/generate_session_id`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
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
    caption?: string,
  ): Promise<{ message: string; session_id: string; filename: string; model_url?: string }> {
    // Refresh session if needed before making API call
    await this.refreshSessionIfNeeded();

    if (!this.sessionId || !this.isSessionValid()) {
      // Try to get a fresh session
      this.sessionId = await this.getOrCreateSession();
    }

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
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to process furniture images');
    }

    return await response.json();
  }

  // Service to get list of model file names as URLs.
  async getSessionModels(): Promise<string[]> {
    // Refresh session if needed before making API call
    await this.refreshSessionIfNeeded();

    if (!this.sessionId || !this.isSessionValid()) {
      // Try to get a fresh session
      this.sessionId = await this.getOrCreateSession();
    }

    if (!this.sessionId) {
      throw new Error('Session ID not set.');
    }
    const response = await fetch(`${this.api_url}/api/session_models/${this.sessionId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch session models');
    }

    const data = await response.json();
    // Convert file names to URLs
    const models = (data.models || []).map(
      (fileName: string) => `${this.api_url}/api/sessions/${this.sessionId}/models/${fileName}`,
    );
    return models;
  }

  // Manually clear session (useful for logout or error handling)
  public clearSession(): void {
    this.sessionId = null;
    this.clearStoredSession();
    console.log('Session cleared');
  }

  // Get session expiry info for debugging
  public getSessionInfo(): { sessionId: string | null; expiresAt: Date | null; isValid: boolean } {
    const storedExpiry = localStorage.getItem(this.SESSION_EXPIRY_KEY);
    return {
      sessionId: this.sessionId,
      expiresAt: storedExpiry ? new Date(parseInt(storedExpiry, 10)) : null,
      isValid: this.isSessionValid(),
    };
  }

  public deleteAllModels(): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`${this.api_url}/api/delete_all_models/${this.sessionId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete all models');
          }
          resolve();
        })
        .catch((error) => {
          console.error('Error deleting all models:', error);
          reject(error);
        });
    });
  }
}
