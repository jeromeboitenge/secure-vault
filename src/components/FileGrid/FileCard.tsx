import { memo, useCallback } from 'react';
import {
  FileText, File, Image, Code, Folder, Lock,
} from '../UI/Icons';
import type { FileNode } from '../../context/VaultContext';
import { useVaultState, useVaultDispatch } from '../../context/VaultContext';
import { buildBreadcrumb, findAncestorIds } from '../../hooks/useFlatTree';
import rootData from '../../data/data.json';
import './FileCard.css';

const ROOT = rootData as FileNode;

function getIcon(node: FileNode) {
  if (node.type === 'folder') return <Folder size={28} />;
  switch (node.fileType) {
    case 'pdf':
    case 'doc':  return <FileText size={28} />;
    case 'jpg':  return <Image size={28} />;
    case 'json': return <Code size={28} />;
    default:     return <File size={28} />;
  }
}

function getIconClass(node: FileNode) {
  if (node.type === 'folder') return 'file-card__icon--folder';
  switch (node.fileType) {
    case 'pdf':  return 'file-card__icon--pdf';
    case 'doc':  return 'file-card__icon--doc';
    case 'jpg':  return 'file-card__icon--img';
    case 'json': return 'file-card__icon--json';
    default:     return 'file-card__icon--txt';
  }
}

interface FileCardProps {
  node: FileNode;
}

export const FileCard = memo(function FileCard({ node }: FileCardProps) {
  const { selectedFile } = useVaultState();
  const dispatch = useVaultDispatch();
  const isSelected = selectedFile?.id === node.id;

  const handleClick = useCallback(() => {
    dispatch({ type: 'SET_FOCUSED_NODE', payload: node.id });

    if (node.type === 'folder') {
      // Navigate INTO the folder — update grid view
      dispatch({ type: 'NAVIGATE_TO_FOLDER', payload: node.id });
      // Expand it in the sidebar tree too
      const ancestors = findAncestorIds(ROOT, node.id) ?? [];
      dispatch({ type: 'EXPAND_FOLDERS', payload: [...ancestors, node.id] });
      // Update breadcrumb
      const crumb = buildBreadcrumb(ROOT, node.id);
      dispatch({ type: 'SET_BREADCRUMB_PATH', payload: crumb });
    } else {
      // Select the file — open properties panel
      dispatch({ type: 'SELECT_FILE', payload: node });
      const crumb = buildBreadcrumb(ROOT, node.id);
      dispatch({ type: 'SET_BREADCRUMB_PATH', payload: crumb });
    }
  }, [dispatch, node]);

  return (
    <article
      className={`file-card ${isSelected ? 'file-card--selected' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      aria-label={`${node.name}${node.encrypted ? ', encrypted' : ''}${node.size ? `, ${node.size}` : ''}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }}}
    >
      <div className={`file-card__icon ${getIconClass(node)}`}>
        {getIcon(node)}
        {node.encrypted && (
          <span className="file-card__lock" title="AES-256 encrypted">
            <Lock size={11} />
          </span>
        )}
      </div>
      <div className="file-card__info">
        <span className="file-card__name truncate" title={node.name}>{node.name}</span>
        {node.type === 'folder' && node.children && (
          <span className="file-card__size mono">{node.children.length} item{node.children.length !== 1 ? 's' : ''}</span>
        )}
        {node.type === 'file' && node.size && (
          <span className="file-card__size mono">{node.size}</span>
        )}
        {node.modified && (
          <span className="file-card__date">{node.modified}</span>
        )}
      </div>
    </article>
  );
});
