/**
 * Module Registry
 * 
 * Manages module discovery and registration
 */

import { ModuleManifest } from './types';
import { moduleLoader } from './module-loader';

export class ModuleRegistry {
  private availableModules: Map<string, ModuleManifest> = new Map();
  
  /**
   * Discover available modules
   */
  async discoverModules(): Promise<ModuleManifest[]> {
    try {
      // In production, this would query the platform API
      const modules = await this.fetchAvailableModules();
      
      for (const module of modules) {
        this.availableModules.set(module.id, module);
      }
      
      return modules;
    } catch (error) {
      console.error('Failed to discover modules:', error);
      throw error;
    }
  }
  
  /**
   * Get available modules
   */
  getAvailableModules(): ModuleManifest[] {
    return Array.from(this.availableModules.values());
  }
  
  /**
   * Auto-load modules for user
   */
  async autoLoadModules(): Promise<void> {
    // Get user's enabled modules
    const enabledModules = await this.getUserEnabledModules();
    
    // Load each enabled module
    for (const moduleId of enabledModules) {
      try {
        await moduleLoader.loadModule(moduleId);
      } catch (error) {
        console.error(`Failed to auto-load module ${moduleId}:`, error);
      }
    }
  }
  
  /**
   * Fetch available modules from platform
   */
  private async fetchAvailableModules(): Promise<ModuleManifest[]> {
    // Mock implementation - in production, fetch from API
    return [
      {
        id: 'investment',
        name: 'Investment Management',
        version: '1.0.0',
        description: 'Investment lifecycle management',
        dependencies: {
          platform: '>=1.0.0'
        },
        ui: {
          routes: [
            { path: '/assessments', component: 'AssessmentList' },
            { path: '/assessments/:id', component: 'AssessmentDetail' },
            { path: '/leads', component: 'LeadList' },
            { path: '/deals', component: 'DealList' }
          ],
          navigation: [
            { id: 'assessments', label: 'Assessments', path: '/assessments', icon: 'clipboard' },
            { id: 'leads', label: 'Leads', path: '/leads', icon: 'users' },
            { id: 'deals', label: 'Deals', path: '/deals', icon: 'briefcase' }
          ],
          permissions: ['investment.view']
        },
        api: {
          baseUrl: '/api/investment/v1',
          version: 'v1',
          endpoints: []
        },
        features: {
          leadScoring: true,
          marketIntelligence: true
        }
      }
    ];
  }
  
  /**
   * Get user's enabled modules
   */
  private async getUserEnabledModules(): Promise<string[]> {
    // Mock implementation - in production, fetch from user preferences
    return ['investment'];
  }
}

export const moduleRegistry = new ModuleRegistry();
