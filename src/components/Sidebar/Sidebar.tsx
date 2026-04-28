/**
 * Sidebar Component
 * 
 * The left navigation sidebar that matches the exact design from screenshots.
 * Contains navigation menu items like "New Volume", "All Files", etc.
 * and the file tree below.
 */

import React from 'react';
import { 
  Plus, 
  Files, 
  Lock, 
  Users, 
  Clock, 
  Trash2,
  HardDrive
} from '../UI/Icons';
import './Sidebar.css';

interface SidebarProps {
  /** Current active navigation item */
  activeItem?: string;
  
  /** Callback when navigation item is clicked */
  onNavigationClick?: (item: string) => void;
  
  /** File tree component to render below navigation */
  fileTree?: React.ReactNode;
  
  /** Search component for filtering files */
  searchComponent?: React.ReactNode;
  
  /** Storage usage information */
  storageUsed?: number; // Percentage (0-100)
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Navigation menu items exactly as shown in screenshots
 */
const navigationItems = [
  {
    id: 'new-volume',
    label: 'New Volume',
    icon: Plus,
    isPrimary: true, // This gets the blue button styling
  },
  {
    id: 'all-files',
    label: 'All Files',
    icon: Files,
    isDefault: true, // This is the default active item
  },
  {
    id: 'encrypted-volumes',
    label: 'Encrypted Volumes',
    icon: Lock,
  },
  {
    id: 'shared',
    label: 'Shared',
    icon: Users,
  },
  {
    id: 'recent',
    label: 'Recent',
    icon: Clock,
  },
  {
    id: 'trash',
    label: 'Trash',
    icon: Trash2,
  },
];

/**
 * Sidebar component with navigation and file tree
 */
export function Sidebar({
  activeItem = 'all-files',
  onNavigationClick,
  fileTree,
  searchComponent,
  storageUsed = 82, // Default to 82% as shown in screenshots
  className = ''
}: SidebarProps) {
  
  /**
   * Handles clicking on a navigation item
   */
  const handleNavigationClick = (itemId: string) => {
    onNavigationClick?.(itemId);
  };

  return (
    <div className={`sidebar ${className}`} data-testid="sidebar">
      {/* Navigation Menu */}
      <nav className="sidebar__navigation" role="navigation" aria-label="Main navigation">
        <ul className="sidebar__nav-list">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id} className="sidebar__nav-item">
                <button
                  className={`sidebar__nav-button ${
                    item.isPrimary ? 'sidebar__nav-button--primary' : ''
                  } ${
                    isActive ? 'sidebar__nav-button--active' : ''
                  }`}
                  onClick={() => handleNavigationClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  data-testid={`nav-${item.id}`}
                >
                  <Icon 
                    className="sidebar__nav-icon" 
                    size={16}
                    aria-hidden="true"
                  />
                  <span className="sidebar__nav-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Search Component (if provided) */}
      {searchComponent && (
        <div className="sidebar__search">
          {searchComponent}
        </div>
      )}

      {/* File Tree */}
      <div className="sidebar__content">
        {fileTree}
      </div>

      {/* Storage Usage Bar - Exactly as shown in screenshots */}
      <div className="sidebar__footer">
        <div className="sidebar__storage">
          <div className="sidebar__storage-header">
            <HardDrive 
              className="sidebar__storage-icon" 
              size={14}
              aria-hidden="true"
            />
            <span className="sidebar__storage-label">Storage Usage</span>
          </div>
          
          <div className="sidebar__storage-bar">
            <div 
              className="sidebar__storage-fill"
              style={{ width: `${storageUsed}%` }}
              role="progressbar"
              aria-valuenow={storageUsed}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Storage usage: ${storageUsed}%`}
            />
          </div>
          
          <div className="sidebar__storage-text">
            <span className="sidebar__storage-percentage">{storageUsed}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}