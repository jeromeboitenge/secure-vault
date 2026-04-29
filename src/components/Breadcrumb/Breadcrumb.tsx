import { useCallback } from 'react';
import { ChevronRight, Folder } from '../UI/Icons';
import { useVaultState, useVaultDispatch } from '../../context/VaultContext';
import { buildBreadcrumb } from '../../hooks/useFlatTree';
import rootData from '../../data/data.json';
import type { FileNode } from '../../context/VaultContext';
import './Breadcrumb.css';

const ROOT = rootData as FileNode;

export function Breadcrumb() {
  const { breadcrumbPath } = useVaultState();
  const dispatch = useVaultDispatch();

  const handleNavigate = useCallback((nodeId: string) => {
    if (nodeId === 'root') {
      dispatch({ type: 'NAVIGATE_TO_FOLDER', payload: 'root' });
      dispatch({ type: 'SET_BREADCRUMB_PATH', payload: [] });
    } else {
      dispatch({ type: 'NAVIGATE_TO_FOLDER', payload: nodeId });
      const crumb = buildBreadcrumb(ROOT, nodeId);
      dispatch({ type: 'SET_BREADCRUMB_PATH', payload: crumb });
    }
  }, [dispatch]);

  return (
    <nav className="breadcrumb" aria-label="Location">
      <ol className="breadcrumb__list">
        {/* Root Vault segment */}
        <li className="breadcrumb__segment">
          <button
            className="breadcrumb__item breadcrumb__item--root breadcrumb__item--link"
            onClick={() => handleNavigate('root')}
            aria-label="Navigate to Vault root"
          >
            <Folder size={13} />
            <span>Vault</span>
          </button>
          {breadcrumbPath.length > 0 && (
            <span className="breadcrumb__sep" aria-hidden="true">
              <ChevronRight size={12} />
            </span>
          )}
        </li>

        {breadcrumbPath.filter(node => node.id !== 'root').map((node, index, arr) => {
          const isLast = index === arr.length - 1;
          return (
            <li key={node.id} className="breadcrumb__segment">
              {isLast ? (
                <span className="breadcrumb__item breadcrumb__item--active">
                  {node.name}
                </span>
              ) : (
                <button
                  className="breadcrumb__item breadcrumb__item--link"
                  onClick={() => handleNavigate(node.id)}
                >
                  {node.name}
                </button>
              )}
              {!isLast && (
                <span className="breadcrumb__sep" aria-hidden="true">
                  <ChevronRight size={12} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
