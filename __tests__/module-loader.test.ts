/**
 * Universal Frontend Test Suite
 */

import { render, screen } from '@testing-library/react';
import { moduleLoader } from '@/core/module-loader';

describe('Module Loader', () => {
  test('loads investment module', async () => {
    const manifest = await moduleLoader.loadModule('investment');
    
    expect(manifest.id).toBe('investment');
    expect(manifest.name).toBe('Investment Management');
    expect(manifest.ui.routes.length).toBeGreaterThan(0);
  });
  
  test('registers routes correctly', async () => {
    await moduleLoader.loadModule('investment');
    const routes = moduleLoader.getRoutes();
    
    expect(routes).toContainEqual(
      expect.objectContaining({
        path: '/assessments',
        component: 'AssessmentList'
      })
    );
  });
  
  test('registers navigation correctly', async () => {
    await moduleLoader.loadModule('investment');
    const navigation = moduleLoader.getNavigation();
    
    expect(navigation).toContainEqual(
      expect.objectContaining({
        id: 'assessments',
        label: 'Assessments',
        path: '/assessments'
      })
    );
  });
});
