import { FileCard } from './FileCard';
import type { FileNode } from '../../context/VaultContext';
import rootData from '../../data/data.json';
import './FileGrid.css';

const ROOT = rootData as FileNode;

export function FileGrid() {
  const items = ROOT.children ?? [];

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
