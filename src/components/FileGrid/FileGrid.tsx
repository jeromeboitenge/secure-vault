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
            <div className="file-grid__empty-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3>This folder is empty</h3>
            <p>No cryptographic assets found in this directory. Drag and drop local volumes or upload new files to begin encryption.</p>
            
            <div className="file-grid__drop-zone">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <span>DRAG FILES HERE</span>
            </div>
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
