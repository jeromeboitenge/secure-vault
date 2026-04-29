import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Search, X, Folder, FileText, File, Image, Code,
  ArrowUp, ArrowDown, CornerDownLeft, Clock,
} from '../UI/Icons';
import { useVaultState, useVaultDispatch, type FileNode } from '../../context/VaultContext';
import { useSearch, type SearchResult } from '../../hooks/useSearch';
import { findAncestorIds, buildBreadcrumb } from '../../hooks/useFlatTree';
import rootData from '../../data/data.json';
import './SearchBar.css';

const ROOT = rootData as FileNode;

// Recent items — top-level children as quick picks
const RECENTS: FileNode[] = (ROOT.children ?? []).slice(0, 5);

function getResultIcon(node: FileNode) {
  if (node.type === 'folder') return <Folder size={14} />;
  switch (node.fileType) {
    case 'pdf':
    case 'doc':  return <FileText size={14} />;
    case 'jpg':  return <Image size={14} />;
    case 'json': return <Code size={14} />;
    default:     return <File size={14} />;
  }
}

function HighlightResult({ name, start, end }: { name: string; start: number; end: number }) {
  return (
    <span>
      {name.slice(0, start)}
      <mark className="search__highlight">{name.slice(start, end)}</mark>
      {name.slice(end)}
    </span>
  );
}

export function SearchBar() {
  const { isCommandPaletteOpen } = useVaultState();
  const dispatch = useVaultDispatch();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const { folderResults, fileResults, allResults } = useSearch(ROOT, query);

  const displayItems: Array<SearchResult | { node: FileNode; path: FileNode[]; isRecent: true }> =
    query.trim()
      ? [...folderResults, ...fileResults]
      : RECENTS.map((n) => ({ node: n, path: [ROOT, n], isRecent: true as const }));

  // Auto-focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setQuery('');
      setActiveIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isCommandPaletteOpen]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const close = useCallback(() => {
    dispatch({ type: 'SET_COMMAND_PALETTE', payload: false });
  }, [dispatch]);

  const selectItem = useCallback((item: typeof displayItems[number]) => {
    const node = item.node;
    // Expand all ancestor folders
    const ancestors = findAncestorIds(ROOT, node.id) ?? [];
    dispatch({ type: 'EXPAND_FOLDERS', payload: ancestors });

    if (node.type === 'file') {
      dispatch({ type: 'SELECT_FILE', payload: node });
      const crumb = buildBreadcrumb(ROOT, node.id);
      dispatch({ type: 'SET_BREADCRUMB_PATH', payload: crumb });
    } else {
      dispatch({ type: 'EXPAND_FOLDER', payload: node.id });
      const crumb = buildBreadcrumb(ROOT, node.id);
      dispatch({ type: 'SET_BREADCRUMB_PATH', payload: crumb });
    }

    dispatch({ type: 'SET_FOCUSED_NODE', payload: node.id });
    close();

    // Scroll the tree to the selected item after modal closes
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.querySelector(`[data-node-id="${node.id}"]`);
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 50);
    });
  }, [dispatch, close]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, displayItems.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && displayItems[activeIdx]) {
      e.preventDefault();
      selectItem(displayItems[activeIdx]);
    }
  }, [activeIdx, displayItems, close, selectItem]);

  if (!isCommandPaletteOpen) return null;

  const hasFolders = query.trim() && folderResults.length > 0;
  const hasFiles   = query.trim() && fileResults.length > 0;
  const showRecent = !query.trim();

  let itemIdx = -1;

  return (
    <div
      className="search-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="search-modal" onKeyDown={handleKeyDown}>
        {/* Input */}
        <div className="search-modal__input-row">
          <Search size={16} className="search-modal__icon" />
          <input
            ref={inputRef}
            className="search-modal__input"
            type="text"
            placeholder="Search files and folders…"
            value={query}
            aria-label="Search vault"
            aria-autocomplete="list"
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
          />
          {query && (
            <button
              className="search-modal__clear"
              onClick={() => { setQuery(''); setActiveIdx(0); inputRef.current?.focus(); }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="search-modal__esc">Esc</kbd>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          className="search-modal__results"
          role="listbox"
          aria-label="Search results"
        >
          {showRecent && (
            <li className="search-modal__section-label">
              <Clock size={11} /> Recent
            </li>
          )}

          {hasFolders && (
            <li className="search-modal__section-label">
              <Folder size={11} /> Folders
            </li>
          )}

          {(hasFolders ? folderResults : []).map((result) => {
            itemIdx++;
            const idx = itemIdx;
            const isActive = activeIdx === idx;
            return (
              <li
                key={result.node.id}
                data-idx={idx}
                role="option"
                aria-selected={isActive}
                className={`search-modal__item ${isActive ? 'search-modal__item--active' : ''}`}
                onClick={() => selectItem(result)}
              >
                <span className={`search-modal__item-icon search-modal__item-icon--folder`}>
                  {getResultIcon(result.node)}
                </span>
                <span className="search-modal__item-info">
                  <span className="search-modal__item-name">
                    <HighlightResult
                      name={result.node.name}
                      start={result.matchStart}
                      end={result.matchEnd}
                    />
                  </span>
                  <span className="search-modal__item-path mono">
                    {result.path.map((n) => n.name).join(' / ')}
                  </span>
                </span>
              </li>
            );
          })}

          {hasFiles && (
            <li className="search-modal__section-label">
              <File size={11} /> Files
            </li>
          )}

          {(hasFiles ? fileResults : showRecent ? displayItems : []).map((result) => {
            itemIdx++;
            const idx = itemIdx;
            const isActive = activeIdx === idx;
            return (
              <li
                key={result.node.id}
                data-idx={idx}
                role="option"
                aria-selected={isActive}
                className={`search-modal__item ${isActive ? 'search-modal__item--active' : ''}`}
                onClick={() => selectItem(result)}
              >
                <span className={`search-modal__item-icon ${result.node.type === 'folder' ? 'search-modal__item-icon--folder' : 'search-modal__item-icon--file'}`}>
                  {getResultIcon(result.node)}
                </span>
                <span className="search-modal__item-info">
                  <span className="search-modal__item-name">
                    {'matchStart' in result ? (
                      <HighlightResult
                        name={result.node.name}
                        start={result.matchStart}
                        end={result.matchEnd}
                      />
                    ) : (
                      result.node.name
                    )}
                  </span>
                  <span className="search-modal__item-path mono">
                    {result.path.map((n) => n.name).join(' / ')}
                  </span>
                </span>
                {result.node.type === 'file' && result.node.size && (
                  <span className="search-modal__item-size mono">{result.node.size}</span>
                )}
              </li>
            );
          })}

          {query.trim() && allResults.length === 0 && (
            <li className="search-modal__empty">
              No results for <strong>"{query}"</strong>
            </li>
          )}
        </ul>

        {/* Footer hints */}
        <div className="search-modal__footer">
          <span><ArrowUp size={11} /><ArrowDown size={11} /> Navigate</span>
          <span><CornerDownLeft size={11} /> Select</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
