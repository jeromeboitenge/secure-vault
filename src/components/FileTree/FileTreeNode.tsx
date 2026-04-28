/**
 * FileTreeNode Component
 * 
 * Represents a single node in the file tree - either a file or folder.
 * This component handles the visual representation, interactions, and
 * accessibility for individual tree items.
 */

import React, { memo, useCallback } from 'react';
import { 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  Image, 
  Code, 
  Database,
  Key,
  Settings
} from '../UI/Icons';
import type { FileNode } from '../../types';
import { formatFileSize } from '../../data/sampleData';
import './FileTreeNode.css';

interface FileTreeNodeProps {
  /** The file or folder node to display */
  node: FileNode;
  
  /** How deep this node is nested (0 = root level) */
  level: number;
  
  /** Whether this folder is expanded (only applies to folders) */
  isExpanded?: boolean;
  
  /** Whether this file is currently selected */
  isSelected?: boolean;
  
  /** Whether this node currently has keyboard focus */
  isFocused?: boolean;
  
  /** Current search query for highlighting matches */
  searchQuery?: string;
  
  /** Callback when folder is toggled (expanded/collapsed) */
  onToggle?: () => void;
  
  /** Callback when file is selected */
  onSelect?: () => void;
  
  /** Callback when node receives focus */
  onFocus?: () => void;
  
  /** Child nodes (for folders) */
  children?: React.ReactNode;
}

/**
 * Gets the appropriate icon for a file based on its type
 */
function getFileIcon(fileType?: string) {
  if (!fileType) return File;
  
  const type = fileType.toLowerCase();
  
  // Document types
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(type)) {
    return FileText;
  }
  
  // Image types
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(type)) {
    return Image;
  }
  
  // Code types
  if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'yml', 'yaml'].includes(type)) {
    return Code;
  }
  
  // Database types
  if (['db', 'sql', 'sqlite'].includes(type)) {
    return Database;
  }
  
  // Security types
  if (['pem', 'key', 'cert', 'p12'].includes(type)) {
    return Key;
  }
  
  // Config types
  if (['config', 'conf', 'ini', 'env'].includes(type)) {
    return Settings;
  }
  
  return File;
}

/**
 * Highlights search matches in text
 */
function highlightSearchMatch(text: string, searchQuery: string): React.ReactNode {
  if (!searchQuery.trim()) {
    return text;
  }
  
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (regex.test(part)) {
      return (
        <span key={index} className="file-tree-node__highlight">
          {part}
        </span>
      );
    }
    return part;
  });
}

/**
 * Individual file tree node component
 */
export const FileTreeNode = memo<FileTreeNodeProps>(({
  node,
  level,
  isExpanded = false,
  isSelected = false,
  isFocused = false,
  searchQuery = '',
  onToggle,
  onSelect,
  onFocus,
  children
}) => {
  
  /**
   * Handles clicking on the node
   */
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Focus this node
    onFocus?.();
    
    if (node.type === 'folder') {
      // Toggle folder expansion
      onToggle?.();
    } else {
      // Select file
      onSelect?.();
    }
  }, [node.type, onToggle, onSelect, onFocus]);

  /**
   * Handles keyboard interactions
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (node.type === 'folder') {
          onToggle?.();
        } else {
          onSelect?.();
        }
        break;
      
      case 'ArrowRight':
        if (node.type === 'folder' && !isExpanded) {
          event.preventDefault();
          onToggle?.();
        }
        break;
      
      case 'ArrowLeft':
        if (node.type === 'folder' && isExpanded) {
          event.preventDefault();
          onToggle?.();
        }
        break;
    }
  }, [node.type, isExpanded, onToggle, onSelect]);

  // Calculate indentation based on nesting level
  const indentStyle = {
    paddingLeft: `${level * 16 + 12}px` // 16px per level + 12px base padding
  };

  // Get appropriate icon
  const IconComponent = node.type === 'folder' 
    ? (isExpanded ? FolderOpen : Folder)
    : getFileIcon(node.fileType);

  // Calculate item count for folders
  const itemCount = node.type === 'folder' && node.children 
    ? node.children.length 
    : undefined;

  return (
    <div className="file-tree-node__container">
      {/* Main node button */}
      <button
        className={`file-tree-node ${
          isSelected ? 'file-tree-node--selected' : ''
        } ${
          isFocused ? 'file-tree-node--focused' : ''
        }`}
        style={indentStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="treeitem"
        aria-level={level + 1}
        aria-expanded={node.type === 'folder' ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={isFocused ? 0 : -1}
        data-node-id={node.id}
        data-testid={`tree-node-${node.id}`}
      >
        {/* Chevron for folders */}
        {node.type === 'folder' && (
          <ChevronRight 
            className={`file-tree-node__chevron ${
              isExpanded ? 'file-tree-node__chevron--expanded' : ''
            }`}
            size={14}
            aria-hidden="true"
          />
        )}
        
        {/* File/folder icon */}
        <IconComponent 
          className="file-tree-node__icon"
          size={16}
          aria-hidden="true"
        />
        
        {/* Node name with search highlighting */}
        <span className="file-tree-node__name">
          {highlightSearchMatch(node.name, searchQuery)}
        </span>
        
        {/* File size or folder item count */}
        <span className="file-tree-node__meta">
          {node.type === 'file' && node.size !== undefined && (
            <span className="file-tree-node__size">
              {formatFileSize(node.size)}
            </span>
          )}
          {node.type === 'folder' && itemCount !== undefined && (
            <span className="file-tree-node__count">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          )}
        </span>
        
        {/* Encryption indicator */}
        {node.encrypted && (
          <span 
            className="file-tree-node__encrypted"
            aria-label="Encrypted file"
            title="This file is encrypted"
          >
            🔒
          </span>
        )}
      </button>
      
      {/* Children container with animation */}
      {node.type === 'folder' && children && (
        <div 
          className={`file-tree-node__children ${
            isExpanded ? 'file-tree-node__children--expanded' : ''
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
});

FileTreeNode.displayName = 'FileTreeNode';