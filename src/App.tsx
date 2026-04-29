import './styles/global.css';
import { VaultProvider, useVaultState } from './context/VaultContext';
import { LayoutContainer } from './components/Layout/LayoutContainer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { FileGrid } from './components/FileGrid/FileGrid';
import { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel';
import { Breadcrumb } from './components/Breadcrumb/Breadcrumb';
import { SearchBar } from './components/SearchBar/SearchBar';

function AppContent() {
  const { selectedFile } = useVaultState();

  return (
    <LayoutContainer
      sidebar={<Sidebar />}
      mainContent={
        <>
          <div style={{ 
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--color-border-subtle)'
          }}>
            <SearchBar />
            <Breadcrumb />
          </div>
          <FileGrid />
        </>
      }
      propertiesPanel={<PropertiesPanel />}
      showPropertiesPanel={selectedFile !== null}
    />
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
