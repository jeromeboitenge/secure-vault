/**
 * FileTree Component
 * 
 * The main file tree component that displays the hierarchical folder structure.
 * This component handles the recursive rendering of folders and files,
 * exactly matching the tree structure shown in the screenshots.
 */

import React, { useState, useCallback } from 'react';
import { FileTreeNode } from './FileTreeNode';
import type { FileNode } from '../../context/VaultContext';
import './FileTree.css';

interface FileTreeData {
  root: FileNode;
  totalFiles: number;
  totalSize: number;
  lastModified: Date;
}

interface FileTreeProps {
  /** The complete file tree data to display */
  data: FileTreeData;
  
  /** Set of folder IDs that are currently expanded */
  expandedFolders?: Set<string>;
  
  /** ID of the currently selected file */
  selectedFileId?: string;
  
  /** ID of the item that currently has keyboard focus */
  focusedNodeId?: string;
  
  /** Current search query for highlighting matches */
  searchQuery?: string;
  
  /** Callback when a folder is toggled (expanded/collapsed) */
  onToggleFolder?: (folderId: string) => void;
  
  /** Callback when a file is selected */
  onSelectFile?: (fileId: string) => void;
  
  /** Callback when keyboard focus changes */
  onFocusNode?: (nodeId: string) => void;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Main FileTree component that renders the root of the tree
 * and handles all the recursive rendering logic
 */
export function FileTree({
  data,
  expandedFolders = new Set(),
  selectedFileId,
  focusedNodeId,
  searchQuery = '',
  onToggleFolder,
  onSelectFile,
  onFocusNode,
  className = ''
}: FileTreeProps) {
  
  /**
   * Handles toggling a folder's expanded state
   */
  const handleToggleFolder = useCallback((folderId: string) => {
    onToggleFolder?.(folderId);
  }, [onToggleFolder]);

  /**
   * Handles selecting a file
   */
  const handleSelectFile = useCallback((fileId: string) => {
    onSelectFile?.(fileId);
  }, [onSelectFile]);

  /**
   * Handles changing keyboard focus
   */
  const handleFocusNode = useCallback((nodeId: string) => {
    onFocusNode?.(nodeId);
  }, [onFocusNode]);

  /**
   * Recursively renders a file tree node and all its children
   */
  const renderNode = useCallback((node: FileNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFileId === node.id;
    const isFocused = focusedNodeId === node.id;
    
    return (
      <FileTreeNode
        key={node.id}
        node={node}
        level={level}
        isExpanded={isExpanded}
        isSelected={isSelected}
        isFocused={isFocused}
        searchQuery={searchQuery}
        onToggle={() => handleToggleFolder(node.id)}
        onSelect={() => handleSelectFile(node.id)}
        onFocus={() => handleFocusNode(node.id)}
      >
        {/* Recursively render children if folder is expanded */}
        {node.type === 'folder' && isExpanded && node.children && (
          <div className="file-tree__children">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </FileTreeNode>
    );
  }, [
    expandedFolders,
    selectedFileId,
    focusedNodeId,
    searchQuery,
    handleToggleFolder,
    handleSelectFile,
    handleFocusNode
  ]);

  // Don't render anything if there's no data
  if (!data || !data.root) {
    return (
      <div className="file-tree file-tree--empty">
        <div className="file-tree__empty-message">
          <p>No files to display</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`file-tree ${className}`}
      role="tree"
      aria-label="File explorer tree"
      data-testid="file-tree"
    >
      {/* Tree header with summary info */}
      <div className="file-tree__header">
        <div className="file-tree__summary">
          <span className="file-tree__file-count">
            {data.totalFiles} {data.totalFiles === 1 ? 'file' : 'files'}
          </span>
        </div>
      </div>

      {/* Main tree content */}
      <div className="file-tree__content">
        {renderNode(data.root)}
      </div>
    </div>
  );
}

/**
 * Hook for managing file tree state
 * Provides a convenient way to manage expanded folders and selection
 */
export function useFileTreeState() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFileId, setSelectedFileId] = useState<string | undefined>();
  const [focusedNodeId, setFocusedNodeId] = useState<string | undefined>();

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  const selectFile = useCallback((fileId: string) => {
    setSelectedFileId(fileId);
    setFocusedNodeId(fileId);
  }, []);

  const focusNode = useCallback((nodeId: string) => {
    setFocusedNodeId(nodeId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFileId(undefined);
  }, []);

  const expandFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => new Set(prev).add(folderId));
  }, []);

  const collapseFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      newSet.delete(folderId);
      return newSet;
    });
  }, []);

  return {
    expandedFolders,
    selectedFileId,
    focusedNodeId,
    toggleFolder,
    selectFile,
    focusNode,
    clearSelection,
    expandFolder,
    collapseFolder
  };
}