import { useCallback } from 'react';
import { FileCard } from './FileCard';
import type { FileNode } from '../../context/VaultContext';
import { useVaultState, useVaultDispatch } from '../../context/VaultContext';
import { findNodeById, buildBreadcrumb } from '../../hooks/useFlatTree';
import { findAncestorIds } from '../../hooks/useFlatTree';
import rootData from '../../data/data.json';
import './FileGrid.css';

const ROOT = rootData as FileNode;

/** Recursively find a node and return its children */
function getFolderChildren(root: FileNode, folderId: string): FileNode[] {
  const node = findNodeById(root, folderId);
  if (!node) return root.children ?? [];
  return node.children ?? [];
}

export function FileGrid() {
  const { currentFolderId } = useVaultState();
  const dispatch = useVaultDispatch();

  const items = getFolderChildren(ROOT, currentFolderId);

  const handleNavigateUp = useCallback(() => {
    // Find the parent of currentFolderId
    const ancestors = findAncestorIds(ROOT, currentFolderId);
    if (!ancestors || ancestors.length === 0) return;
    const parentId = ancestors[ancestors.length - 1];
    dispatch({ type: 'NAVIGATE_TO_FOLDER', payload: parentId });
    const crumb = buildBreadcrumb(ROOT, parentId);
    // breadcrumb for root should be empty
    dispatch({
      type: 'SET_BREADCRUMB_PATH',
      payload: parentId === 'root' ? [] : crumb,
    });
  }, [currentFolderId, dispatch]);

  return (
    <main className="file-grid" aria-label="File content area">
      <div className="file-grid__inner">
        {/* Back navigation for non-root folders */}
        {currentFolderId !== 'root' && (
          <button
            className="file-grid__back-btn"
            onClick={handleNavigateUp}
            aria-label="Go up one folder level"
          >
            <span className="file-grid__back-icon">←</span>
            <span>Back</span>
          </button>
        )}

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
