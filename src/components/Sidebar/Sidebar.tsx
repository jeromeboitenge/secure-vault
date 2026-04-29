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
  Shield
} from '../UI/Icons';
import { FileTreeNode } from '../FileTree/FileTreeNode';
import { useVaultState, useVaultDispatch, type FileNode } from '../../context/VaultContext';
import rootData from '../../data/data.json';
import './Sidebar.css';

const ROOT = rootData as FileNode;

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
export function Sidebar() {
  const { expandedFolders, selectedFile, focusedNodeId } = useVaultState();
  const dispatch = useVaultDispatch();
  const [activeItem, setActiveItem] = React.useState('all-files');

  /**
   * Handles clicking on a navigation item
   */
  const handleNavigationClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handleToggleFolder = (folderId: string) => {
    dispatch({ type: 'TOGGLE_FOLDER', payload: folderId });
  };

  const handleSelectFile = (fileId: string) => {
    const findNode = (node: FileNode): FileNode | null => {
      if (node.id === fileId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };
    const node = findNode(ROOT);
    if (node) {
      dispatch({ type: 'SELECT_FILE', payload: node });
      dispatch({ type: 'SET_FOCUSED_NODE', payload: fileId });
    }
  };

  const handleFocusNode = (nodeId: string) => {
    dispatch({ type: 'SET_FOCUSED_NODE', payload: nodeId });
  };

  // Count total files
  const countFiles = (node: FileNode): number => {
    let count = node.type === 'file' ? 1 : 0;
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + countFiles(child), 0);
    }
    return count;
  };

  const totalFiles = countFiles(ROOT);

  // Recursive function to render tree nodes
  const renderTreeNode = (node: FileNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFile?.id === node.id;
    const isFocused = focusedNodeId === node.id;

    return (
      <FileTreeNode
        key={node.id}
        node={node}
        level={level}
        isExpanded={isExpanded}
        isSelected={isSelected}
        isFocused={isFocused}
        onToggle={() => handleToggleFolder(node.id)}
        onSelect={() => handleSelectFile(node.id)}
        onFocus={() => handleFocusNode(node.id)}
      >
        {node.type === 'folder' && isExpanded && node.children && (
          <>
            {node.children.map((child) => renderTreeNode(child, level + 1))}
          </>
        )}
      </FileTreeNode>
    );
  };

  return (
    <div className="sidebar" data-testid="sidebar">
      {/* Logo Area */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon-wrapper">
          <Shield size={20} className="sidebar__logo-icon" />
        </div>
        <div className="sidebar__logo-text">
          <h2>SECUREVAULT</h2>
          <span>ADMIN / ROOT</span>
        </div>
      </div>

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

      {/* File Tree */}
      <div className="sidebar__content">
        <div className="file-tree__header">
          <div className="file-tree__summary">
            <span className="file-tree__file-count">
              {totalFiles} {totalFiles === 1 ? 'file' : 'files'}
            </span>
          </div>
        </div>
        {ROOT.children?.map((child) => renderTreeNode(child, 0))}
      </div>

      {/* Storage Usage Bar - Exactly as shown in screenshots */}
      <div className="sidebar__footer">
        <div className="sidebar__storage">
          <div className="sidebar__storage-header">
            <span className="sidebar__storage-label">Storage Usage</span>
            <span className="sidebar__storage-percentage">82%</span>
          </div>
          
          <div className="sidebar__storage-bar">
            <div 
              className="sidebar__storage-fill"
              style={{ width: '82%' }}
              role="progressbar"
              aria-valuenow={82}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Storage usage: 82%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}