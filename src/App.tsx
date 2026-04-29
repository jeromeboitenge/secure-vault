import { useEffect, useRef } from 'react';
import './styles/global.css';
import { VaultProvider, useVaultState, useVaultDispatch } from './context/VaultContext';
import { LayoutContainer } from './components/Layout/LayoutContainer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { FileGrid } from './components/FileGrid/FileGrid';
import { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel';
import { Breadcrumb } from './components/Breadcrumb/Breadcrumb';
import { SearchBar } from './components/SearchBar/SearchBar';
import { useFlatTree } from './hooks/useFlatTree';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import type { FileNode } from './context/VaultContext';
import rootData from './data/data.json';
import { Search } from './components/UI/Icons';

const ROOT = rootData as FileNode;

function AppContent() {
  const { selectedFile, expandedFolders } = useVaultState();
  const dispatch = useVaultDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const flatTree = useFlatTree(ROOT, expandedFolders);

  // Attach keyboard nav to the whole app container
  useKeyboardNav({ flatTree, rootNode: ROOT, containerRef });

  // Global Ctrl+K shortcut (works even when search input has focus, but is
  // guarded in useKeyboardNav only for non-input elements — we add a separate
  // document-level listener to catch it universally)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'SET_COMMAND_PALETTE', payload: true });
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [dispatch]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh', outline: 'none' }} tabIndex={-1}>
      <LayoutContainer
        sidebar={<Sidebar />}
        mainContent={
          <>
            <div style={{
              padding: '0.75rem 2rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}>
              <Breadcrumb />
              {/* Search trigger button */}
              <button
                id="search-trigger-btn"
                className="search-trigger-btn"
                onClick={() => dispatch({ type: 'SET_COMMAND_PALETTE', payload: true })}
                aria-label="Open search (Ctrl+K)"
                title="Search files and folders (Ctrl+K)"
              >
                <Search size={14} />
                <span>Search…</span>
                <kbd>⌘K</kbd>
              </button>
            </div>
            <FileGrid />
          </>
        }
        propertiesPanel={<PropertiesPanel />}
        showPropertiesPanel={selectedFile !== null}
      />
      <SearchBar />
    </div>
  );
}

function App() {
  return (
    <VaultProvider>
      <AppContent />
    </VaultProvider>
  );
}

export default App;
