import React from 'react';
import { FileCard } from './FileCard';
import { useVaultState } from '../../context/VaultContext';
import type { FileNode } from '../../context/VaultContext';
import rootData from '../../data/data.json';
import { findNodeById } from '../../hooks/useFlatTree';
import './FileGrid.css';

const ROOT = rootData as FileNode;

export function FileGrid() {
  const { breadcrumbPath, expandedFolders } = useVaultState();

  // Show children of the currently navigated folder
  const currentFolder =
    breadcrumbPath.length > 0
      ? findNodeById(ROOT, breadcrumbPath[breadcrumbPath.length - 1].id)
      : ROOT;

  const items = currentFolder?.children ?? ROOT.children ?? [];

  return (
    <main className="file-grid" aria-label="File content area">
      <div className="file-grid__inner">
        {items.length === 0 ? (
          <div className="file-grid__empty">
            <span>This folder is empty</span>
          </div>
        ) : (
          <div className="file-grid__cards" role="list" aria-label="Files and folders">
            {items.map((node) => (
              <FileCard key={node.id} node={node} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
