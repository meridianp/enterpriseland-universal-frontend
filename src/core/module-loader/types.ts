/**
 * Module Loader Interface
 * 
 * Provides dynamic loading and registration of business modules
 */

export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  
  dependencies: {
    platform: string;
    modules?: string[];
  };
  
  ui: {
    routes: RouteConfig[];
    navigation: NavigationItem[];
    widgets?: WidgetConfig[];
    permissions: string[];
  };
  
  api: {
    baseUrl: string;
    version: string;
    endpoints: EndpointConfig[];
  };
  
  features: Record<string, boolean>;
}

export interface RouteConfig {
  path: string;
  component: string;
  exact?: boolean;
  permissions?: string[];
  layout?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  permissions?: string[];
  children?: NavigationItem[];
}

export interface WidgetConfig {
  id: string;
  component: string;
  location: string;
  permissions?: string[];
  priority?: number;
}

export interface EndpointConfig {
  path: string;
  methods: string[];
  permissions?: string[];
}
