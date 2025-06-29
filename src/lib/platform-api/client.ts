/**
 * Platform API Client
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResult {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    groups: string[];
  };
}

export class PlatformAPI {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  
  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_PLATFORM_API_URL || 'http://localhost:8000';
  }
  
  /**
   * Authenticate with platform
   */
  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    const response = await fetch(`${this.baseURL}/api/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    this.accessToken = data.access;
    this.refreshToken = data.refresh;
    
    // Store tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
    }
    
    return data;
  }
  
  /**
   * Make authenticated request
   */
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Ensure we have a token
    if (!this.accessToken) {
      await this.loadTokensFromStorage();
    }
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    // Handle token refresh
    if (response.status === 401) {
      await this.refreshAccessToken();
      
      // Retry request with new token
      const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!retryResponse.ok) {
        throw new Error(`API Error: ${retryResponse.statusText}`);
      }
      
      return retryResponse.json();
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Get module manifest
   */
  async getModuleManifest(moduleId: string) {
    return this.request(`/api/modules/${moduleId}/manifest/`);
  }
  
  /**
   * Get platform version
   */
  async getPlatformVersion(): Promise<string> {
    const response = await this.request<{ version: string }>('/api/platform/version/');
    return response.version;
  }
  
  /**
   * Upload file
   */
  async uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseURL}/api/files/upload/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${this.baseURL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: this.refreshToken }),
    });
    
    if (!response.ok) {
      // Refresh failed, clear tokens and redirect to login
      this.clearTokens();
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    this.accessToken = data.access;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access);
    }
  }
  
  /**
   * Load tokens from localStorage
   */
  private async loadTokensFromStorage(): Promise<void> {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }
  
  /**
   * Clear stored tokens
   */
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
  
  /**
   * Logout
   */
  logout(): void {
    this.clearTokens();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

// Export singleton instance
export const platformAPI = new PlatformAPI();
