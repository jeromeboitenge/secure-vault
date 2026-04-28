/**
 * LayoutContainer Component
 * 
 * This is the main layout component that creates the three-column grid
 * structure exactly as shown in the screenshots:
 * - Left: Sidebar (280px fixed width)
 * - Center: Main content area (flexible)
 * - Right: Properties panel (320px, hidden by default)
 */

import React from 'react';
import './LayoutContainer.css';

interface LayoutContainerProps {
  /** Left sidebar content (navigation, file tree) */
  sidebar: React.ReactNode;
  
  /** Main content area (file grid, header) */
  mainContent: React.ReactNode;
  
  /** Right properties panel (file details) */
  propertiesPanel?: React.ReactNode;
  
  /** Whether the properties panel should be visible */
  showPropertiesPanel?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Main layout container using CSS Grid
 * Provides the exact 280px + flexible + 320px layout from screenshots
 */
export function LayoutContainer({
  sidebar,
  mainContent,
  propertiesPanel,
  showPropertiesPanel = false,
  className = ''
}: LayoutContainerProps) {
  return (
    <div 
      className={`layout-container ${showPropertiesPanel ? 'layout-container--with-properties' : ''} ${className}`}
      data-testid="layout-container"
    >
      {/* Left Sidebar - Fixed 280px width */}
      <aside 
        className="layout-sidebar"
        data-testid="layout-sidebar"
      >
        {sidebar}
      </aside>

      {/* Main Content Area - Flexible width */}
      <main 
        className="layout-main"
        data-testid="layout-main"
      >
        {mainContent}
      </main>

      {/* Properties Panel - 320px width, slides in from right */}
      {propertiesPanel && (
        <aside 
          className={`layout-properties ${showPropertiesPanel ? 'layout-properties--visible' : ''}`}
          data-testid="layout-properties"
        >
          {propertiesPanel}
        </aside>
      )}
    </div>
  );
}