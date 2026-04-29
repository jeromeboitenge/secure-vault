import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';

// ── Types ─────────────────────────────────────────────────────
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: 'pdf' | 'doc' | 'jpg' | 'json' | 'txt';
  size?: string;
  modified?: string;
  owner?: string;
  encrypted?: boolean;
  children?: FileNode[];
}

export interface VaultState {
  selectedFile: FileNode | null;
  expandedFolders: Set<string>;
  focusedNodeId: string | null;
  searchQuery: string;
  isCommandPaletteOpen: boolean;
  hasUsedKeyboard: boolean;
  breadcrumbPath: FileNode[];
  currentFolderId: string;
}

export type VaultAction =
  | { type: 'SELECT_FILE'; payload: FileNode | null }
  | { type: 'TOGGLE_FOLDER'; payload: string }
  | { type: 'EXPAND_FOLDER'; payload: string }
  | { type: 'COLLAPSE_FOLDER'; payload: string }
  | { type: 'EXPAND_FOLDERS'; payload: string[] }
  | { type: 'SET_FOCUSED_NODE'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_COMMAND_PALETTE'; payload: boolean }
  | { type: 'SET_HAS_USED_KEYBOARD'; payload: boolean }
  | { type: 'SET_BREADCRUMB_PATH'; payload: FileNode[] }
  | { type: 'NAVIGATE_TO_FOLDER'; payload: string };

// ── Initial State ─────────────────────────────────────────────
const initialState: VaultState = {
  selectedFile: null,
  expandedFolders: new Set(['root']),
  focusedNodeId: null,
  searchQuery: '',
  isCommandPaletteOpen: false,
  hasUsedKeyboard: false,
  breadcrumbPath: [],
  currentFolderId: 'root',
};

// ── Reducer ───────────────────────────────────────────────────
function vaultReducer(state: VaultState, action: VaultAction): VaultState {
  switch (action.type) {
    case 'SELECT_FILE': {
      return { ...state, selectedFile: action.payload };
    }
    case 'TOGGLE_FOLDER': {
      const next = new Set(state.expandedFolders);
      if (next.has(action.payload)) {
        next.delete(action.payload);
      } else {
        next.add(action.payload);
      }
      return { ...state, expandedFolders: next };
    }
    case 'EXPAND_FOLDER': {
      const next = new Set(state.expandedFolders);
      next.add(action.payload);
      return { ...state, expandedFolders: next };
    }
    case 'COLLAPSE_FOLDER': {
      const next = new Set(state.expandedFolders);
      next.delete(action.payload);
      return { ...state, expandedFolders: next };
    }
    case 'EXPAND_FOLDERS': {
      const next = new Set(state.expandedFolders);
      action.payload.forEach((id) => next.add(id));
      return { ...state, expandedFolders: next };
    }
    case 'SET_FOCUSED_NODE': {
      return { ...state, focusedNodeId: action.payload };
    }
    case 'SET_SEARCH_QUERY': {
      return { ...state, searchQuery: action.payload };
    }
    case 'SET_COMMAND_PALETTE': {
      return { ...state, isCommandPaletteOpen: action.payload };
    }
    case 'SET_HAS_USED_KEYBOARD': {
      return { ...state, hasUsedKeyboard: action.payload };
    }
    case 'SET_BREADCRUMB_PATH': {
      return { ...state, breadcrumbPath: action.payload };
    }
    case 'NAVIGATE_TO_FOLDER': {
      return { ...state, currentFolderId: action.payload, selectedFile: null };
    }
    default:
      return state;
  }
}

// ── Contexts (split for perf) ─────────────────────────────────
const VaultStateContext = createContext<VaultState | null>(null);
const VaultDispatchContext = createContext<React.Dispatch<VaultAction> | null>(null);

// ── Provider ──────────────────────────────────────────────────
export function VaultProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(vaultReducer, initialState);
  return (
    <VaultStateContext.Provider value={state}>
      <VaultDispatchContext.Provider value={dispatch}>
        {children}
      </VaultDispatchContext.Provider>
    </VaultStateContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────
export function useVaultState(): VaultState {
  const ctx = useContext(VaultStateContext);
  if (!ctx) throw new Error('useVaultState must be used within VaultProvider');
  return ctx;
}

export function useVaultDispatch(): React.Dispatch<VaultAction> {
  const ctx = useContext(VaultDispatchContext);
  if (!ctx) throw new Error('useVaultDispatch must be used within VaultProvider');
  return ctx;
}
