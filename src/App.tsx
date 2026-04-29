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
import { Search } from './components/UI/Icons';
import { KeyboardLegend } from './components/UI/KeyboardLegend';

function AppContent() {
  const { fileTree, selectedFile, expandedFolders, breadcrumbPath } = useVaultState();
  const dispatch = useVaultDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const flatTree = useFlatTree(fileTree, expandedFolders);

  // Attach keyboard nav to the whole app container
  useKeyboardNav({ flatTree, rootNode: fileTree, containerRef });

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
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--color-bg-base)',
            }}>
              {/* Top Bar */}
              <div style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Breadcrumb />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--color-text-secondary)' }}>
                  <button onClick={() => dispatch({ type: 'SET_COMMAND_PALETTE', payload: true })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                    <Search size={16} />
                  </button>
                  {/* Bell icon placeholder - using an existing icon or a simple bell path */}
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  
                  {/* Settings icon */}
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                  
                  {/* Avatar */}
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d3748, #1a202c)', border: '1px solid #7e62f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="#f6ad55" stroke="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                </div>
              </div>

              {/* Sub-Header */}
              <div style={{
                padding: '1.5rem 2rem 0.5rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-secondary)', letterSpacing: '0.5px' }}>
                  <span style={{ color: 'var(--color-accent-primary)' }}>&gt;</span>
                  <span>ACTIVE DIRECTORY: {breadcrumbPath.length > 0 ? breadcrumbPath[breadcrumbPath.length - 1].name.toUpperCase() : 'ROOT'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="#7e62f9" stroke="#7e62f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </div>
              </div>
            </div>
            <FileGrid />
          </>
        }
        propertiesPanel={<PropertiesPanel />}
        showPropertiesPanel={selectedFile !== null}
      />
      <KeyboardLegend />
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
