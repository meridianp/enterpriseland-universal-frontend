/**
 * Module Loader Implementation
 */

import { ModuleManifest, RouteConfig, NavigationItem } from './types';
import { PlatformAPI } from '../services/platform-api';

export class ModuleLoader {
  private modules: Map<string, ModuleManifest> = new Map();
  private loadedComponents: Map<string, any> = new Map();
  private routes: RouteConfig[] = [];
  private navigation: NavigationItem[] = [];
  
  constructor(private platformAPI: PlatformAPI) {}
  
  /**
   * Load a module by ID
   */
  async loadModule(moduleId: string): Promise<ModuleManifest> {
    try {
      // Check if already loaded
      if (this.modules.has(moduleId)) {
        return this.modules.get(moduleId)!;
      }
      
      // Fetch module manifest
      const manifest = await this.platformAPI.getModuleManifest(moduleId);
      
      // Validate dependencies
      await this.validateDependencies(manifest);
      
      // Load module components
      await this.loadModuleComponents(manifest);
      
      // Register routes
      this.registerRoutes(manifest.ui.routes);
      
      // Register navigation
      this.registerNavigation(manifest.ui.navigation);
      
      // Store module
      this.modules.set(moduleId, manifest);
      
      console.log(`✅ Module loaded: ${moduleId}`);
      return manifest;
      
    } catch (error) {
      console.error(`❌ Failed to load module ${moduleId}:`, error);
      throw error;
    }
  }
  
  /**
   * Load multiple modules
   */
  async loadModules(moduleIds: string[]): Promise<ModuleManifest[]> {
    const promises = moduleIds.map(id => this.loadModule(id));
    return Promise.all(promises);
  }
  
  /**
   * Get loaded modules
   */
  getLoadedModules(): ModuleManifest[] {
    return Array.from(this.modules.values());
  }
  
  /**
   * Get routes from all loaded modules
   */
  getRoutes(): RouteConfig[] {
    return this.routes;
  }
  
  /**
   * Get navigation from all loaded modules
   */
  getNavigation(): NavigationItem[] {
    return this.navigation;
  }
  
  /**
   * Get component by name
   */
  getComponent(componentName: string): any {
    return this.loadedComponents.get(componentName);
  }
  
  /**
   * Validate module dependencies
   */
  private async validateDependencies(manifest: ModuleManifest): Promise<void> {
    // Check platform version compatibility
    const platformVersion = await this.platformAPI.getPlatformVersion();
    
    // Simple version check (in production, use semver)
    if (!this.isVersionCompatible(platformVersion, manifest.dependencies.platform)) {
      throw new Error(`Platform version ${platformVersion} is not compatible with required ${manifest.dependencies.platform}`);
    }
    
    // Check module dependencies
    if (manifest.dependencies.modules) {
      for (const moduleId of manifest.dependencies.modules) {
        if (!this.modules.has(moduleId)) {
          throw new Error(`Required module not loaded: ${moduleId}`);
        }
      }
    }
  }
  
  /**
   * Load module components dynamically
   */
  private async loadModuleComponents(manifest: ModuleManifest): Promise<void> {
    const moduleId = manifest.id;
    
    // Load each route component
    for (const route of manifest.ui.routes) {
      try {
        const component = await import(`../modules/${moduleId}/${route.component}`);
        this.loadedComponents.set(route.component, component.default || component);
      } catch (error) {
        console.error(`Failed to load component ${route.component} from module ${moduleId}:`, error);
        throw error;
      }
    }
    
    // Load widgets if any
    if (manifest.ui.widgets) {
      for (const widget of manifest.ui.widgets) {
        try {
          const component = await import(`../modules/${moduleId}/${widget.component}`);
          this.loadedComponents.set(widget.component, component.default || component);
        } catch (error) {
          console.error(`Failed to load widget ${widget.component} from module ${moduleId}:`, error);
        }
      }
    }
  }
  
  /**
   * Register routes from module
   */
  private registerRoutes(routes: RouteConfig[]): void {
    this.routes.push(...routes);
  }
  
  /**
   * Register navigation from module
   */
  private registerNavigation(navigation: NavigationItem[]): void {
    this.navigation.push(...navigation);
  }
  
  /**
   * Simple version compatibility check
   */
  private isVersionCompatible(current: string, required: string): boolean {
    // In production, use proper semver comparison
    return true; // Simplified for demo
  }
}

// Create singleton instance
export const moduleLoader = new ModuleLoader(new PlatformAPI());
