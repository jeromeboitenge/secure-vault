import { ChevronRight, Folder } from '../UI/Icons';
import { useVaultState } from '../../context/VaultContext';
import './Breadcrumb.css';

export function Breadcrumb() {
  const { breadcrumbPath } = useVaultState();

  if (breadcrumbPath.length === 0) {
    return (
      <nav className="breadcrumb" aria-label="Location">
          <span className="breadcrumb__item breadcrumb__item--root">
            <Folder size={13} />
            <span>Vault</span>
          </span>
      </nav>
    );
  }

  return (
    <nav className="breadcrumb" aria-label="Location">
      <ol className="breadcrumb__list">
        {breadcrumbPath.map((node, index) => {
          const isLast = index === breadcrumbPath.length - 1;
          return (
            <li key={node.id} className="breadcrumb__segment">
              {index === 0 && (
                <span className="breadcrumb__root-icon">
                  <Folder size={12} />
                </span>
              )}
              <span
                className={`breadcrumb__item ${isLast ? 'breadcrumb__item--active' : ''}`}
              >
                {node.name}
              </span>
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
