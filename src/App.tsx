import React from 'react';
import './styles/global.css';

function App() {
  return (
    <div className="app">
      {/* Left Sidebar */}
      <div style={{
        width: '280px',
        height: '100vh',
        backgroundColor: '#1a1d29',
        color: '#F1F5F9',
        padding: '1rem',
        borderRight: '1px solid #22262F'
      }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>SecureVault</h3>
        
        {/* Navigation Items */}
        <div style={{ marginBottom: '2rem' }}>
          <button style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            marginBottom: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            + New Volume
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {['All Files', 'Encrypted Volumes', 'Shared', 'Recent', 'Trash'].map(item => (
              <button key={item} style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: item === 'All Files' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: '#F1F5F9',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textAlign: 'left',
                borderLeft: item === 'All Files' ? '3px solid #3B82F6' : 'none'
              }}>
                {item}
              </button>
            ))}
          </div>
        </div>
        
        {/* File Tree Placeholder */}
        <div style={{
          flex: 1,
          borderTop: '1px solid #22262F',
          paddingTop: '1rem'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#8B95A8', marginBottom: '1rem' }}>
            15 FILES
          </p>
          <div style={{ fontSize: '0.875rem' }}>
            📁 Legal<br/>
            📁 Finance<br/>
            📁 Human Resources<br/>
            📁 IT & Security
          </div>
        </div>
        
        {/* Storage Usage */}
        <div style={{
          borderTop: '1px solid #22262F',
          paddingTop: '1rem',
          marginTop: 'auto'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#8B95A8', marginBottom: '0.5rem' }}>
            STORAGE USAGE
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#2E3340',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '82%',
              height: '100%',
              background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
              borderRadius: '2px'
            }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#F1F5F9', marginTop: '0.25rem', textAlign: 'right' }}>
            82%
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        backgroundColor: '#0A0C10',
        color: '#F1F5F9',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          SecureVault File Explorer
        </h1>
        <p style={{ color: '#8B95A8' }}>
          Main content area - File grid will go here
        </p>
      </div>
    </div>
  );
}

export default App;