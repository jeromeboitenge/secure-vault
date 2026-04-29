import { useCallback } from 'react';
import { X, Download, Share2, Trash2, Shield, FileText, File, Image, Code, Folder, HardDrive, Lock, Clock, Users } from '../UI/Icons';
import { useVaultState, useVaultDispatch, type FileNode } from '../../context/VaultContext';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import { Divider } from '../UI/Divider';
import './PropertiesPanel.css';

function getLargeIcon(node: FileNode) {
  if (node.type === 'folder') return <Folder size={40} />;
  switch (node.fileType) {
    case 'pdf':
    case 'doc':  return <FileText size={40} />;
    case 'jpg':  return <Image size={40} />;
    case 'json': return <Code size={40} />;
    default:     return <File size={40} />;
  }
}

function getIconClass(node: FileNode): string {
  if (node.type === 'folder') return 'props-panel__icon--folder';
  switch (node.fileType) {
    case 'pdf':  return 'props-panel__icon--pdf';
    case 'doc':  return 'props-panel__icon--doc';
    case 'jpg':  return 'props-panel__icon--img';
    case 'json': return 'props-panel__icon--json';
    default:     return 'props-panel__icon--txt';
  }
}

function formatFileType(node: FileNode): string {
  if (node.type === 'folder') return 'Folder';
  return node.fileType ? node.fileType.toUpperCase() + ' File' : 'File';
}

export function PropertiesPanel() {
  const { selectedFile } = useVaultState();
  const dispatch = useVaultDispatch();

  const handleClose = useCallback(() => {
    dispatch({ type: 'SELECT_FILE', payload: null });
  }, [dispatch]);

  const handleDownload = useCallback(() => {
    // In a real app this would trigger a download
    console.info('Download triggered for:', selectedFile?.name);
  }, [selectedFile]);

  return (
    <aside
      className={`props-panel ${selectedFile ? 'props-panel--open' : ''}`}
      aria-label="File properties"
      aria-live="polite"
    >
      {selectedFile && (
        <>
          {/* Header */}
          <div className="props-panel__header">
            <span className="props-panel__header-title">Properties</span>
            <button
              className="props-panel__close"
              onClick={handleClose}
              aria-label="Close properties panel"
            >
              <X size={16} />
            </button>
          </div>

          {/* Icon */}
          <div className="props-panel__hero">
            <div className={`props-panel__icon ${getIconClass(selectedFile)}`}>
              {getLargeIcon(selectedFile)}
              {selectedFile.encrypted && (
                <span className="props-panel__icon-lock">
                  <Lock size={14} />
                </span>
              )}
            </div>
            <h2 className="props-panel__filename truncate" title={selectedFile.name}>
              {selectedFile.name}
            </h2>
            <div className="props-panel__badges">
              <Badge variant="default">{formatFileType(selectedFile)}</Badge>
              {selectedFile.encrypted && (
                <Badge variant="success" icon={<Shield size={10} />}>
                  AES-256
                </Badge>
              )}
            </div>
          </div>

          <Divider />

          {/* Meta rows */}
          <dl className="props-panel__meta">
            {selectedFile.size && (
              <div className="props-panel__meta-row">
                <dt>
                  <HardDrive size={13} />
                  <span>Size</span>
                </dt>
                <dd className="mono">{selectedFile.size}</dd>
              </div>
            )}
            {selectedFile.modified && (
              <div className="props-panel__meta-row">
                <dt>
                  <Clock size={13} />
                  <span>Modified</span>
                </dt>
                <dd className="mono">{selectedFile.modified}</dd>
              </div>
            )}
            {selectedFile.owner && (
              <div className="props-panel__meta-row">
                <dt>
                  <Users size={13} />
                  <span>Owner</span>
                </dt>
                <dd>{selectedFile.owner}</dd>
              </div>
            )}
            <div className="props-panel__meta-row">
              <dt>
                <Lock size={13} />
                <span>Encryption</span>
              </dt>
              <dd>
                {selectedFile.encrypted ? (
                  <span className="props-panel__encrypted">AES-256 ✓</span>
                ) : (
                  <span className="props-panel__unencrypted">None</span>
                )}
              </dd>
            </div>
          </dl>

          <Divider />

          {/* Action buttons */}
          <div className="props-panel__actions">
            <Button
              variant="primary"
              icon={<Download size={14} />}
              onClick={handleDownload}
              aria-label={`Download ${selectedFile.name}`}
              style={{ width: '100%' }}
            >
              Download
            </Button>
            <div className="props-panel__actions-row">
              <Button
                variant="ghost"
                icon={<Share2 size={14} />}
                aria-label={`Share ${selectedFile.name}`}
                style={{ flex: 1 }}
              >
                Share
              </Button>
              <Button
                variant="danger"
                icon={<Trash2 size={14} />}
                onClick={() => {
                  if (selectedFile) {
                    dispatch({ type: 'DELETE_NODE', payload: selectedFile.id });
                  }
                }}
                aria-label={`Delete ${selectedFile.name}`}
                style={{ flex: 1 }}
              >
                Delete
              </Button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
