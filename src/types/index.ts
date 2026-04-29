
export interface FileNode {
  id: string;
  name: string;

  type: 'file' | 'folder';

  fileType?: string;

  size?: number;

  modified?: Date;


  owner?: string;

  encrypted?: boolean;
  children?: FileNode[];

  path?: string[];

  depth?: number;
}

export interface FileTreeData {

  root: FileNode;

  totalFiles: number;

  totalSize: number;

  lastModified: Date;
}

export interface BreadcrumbItem {

  id: string;

  name: string;

  path: string[];
}

export interface VaultState {

  fileTree: FileTreeData;

  expandedFolders: Set<string>;

  selectedFileId?: string;

  focusedNodeId?: string;


  propertiesPanelOpen: boolean;


  commandPaletteOpen: boolean;

  searchQuery: string;

  viewMode: 'grid' | 'list';

  currentPath: string[];

  /** Breadcrumb items for navigation */
  breadcrumb: BreadcrumbItem[];

  // Keyboard navigation state
  /** Whether the keyboard shortcut legend is visible */
  keyboardLegendVisible: boolean;

  /** Recent files for quick access */
  recentFiles: FileNode[];
}

/**
 * Actions that can be performed to update the application state
 * Each action has a clear, descriptive name
 */
export type VaultAction =
  // File tree actions
  | { type: 'SET_FILE_TREE'; payload: FileTreeData }
  | { type: 'TOGGLE_FOLDER'; payload: { folderId: string } }
  | { type: 'EXPAND_FOLDER'; payload: { folderId: string } }
  | { type: 'COLLAPSE_FOLDER'; payload: { folderId: string } }

  // Selection actions
  | { type: 'SELECT_FILE'; payload: { fileId: string } }
  | { type: 'DESELECT_FILE' }
  | { type: 'SET_FOCUSED_NODE'; payload: { nodeId: string } }
  | { type: 'CLEAR_FOCUS' }

  // UI actions
  | { type: 'TOGGLE_PROPERTIES_PANEL' }
  | { type: 'OPEN_PROPERTIES_PANEL' }
  | { type: 'CLOSE_PROPERTIES_PANEL' }
  | { type: 'TOGGLE_COMMAND_PALETTE' }
  | { type: 'OPEN_COMMAND_PALETTE' }
  | { type: 'CLOSE_COMMAND_PALETTE' }
  | { type: 'SET_VIEW_MODE'; payload: { mode: 'grid' | 'list' } }

  // Search actions
  | { type: 'SET_SEARCH_QUERY'; payload: { query: string } }
  | { type: 'CLEAR_SEARCH' }

  | { type: 'NAVIGATE_TO_PATH'; payload: { path: string[] } }
  | { type: 'UPDATE_BREADCRUMB'; payload: { breadcrumb: BreadcrumbItem[] } }

  | { type: 'SHOW_KEYBOARD_LEGEND' }
  | { type: 'HIDE_KEYBOARD_LEGEND' }
  | { type: 'ADD_RECENT_FILE'; payload: { file: FileNode } };

export interface SearchResult {

  node: FileNode;

  path: string[];

  matchedQuery: string;

  matchType: 'name' | 'path' | 'owner' | 'type';
}

export interface KeyboardShortcut {

  keys: string[];

  description: string;

  category: 'navigation' | 'search' | 'selection' | 'general';
}

export interface VaultError {

  code: string;

  message: string;

  details?: Record<string, any>;

  timestamp: Date;
}
export interface ValidationResult {

  isValid: boolean;

  errors: VaultError[];

  warnings: VaultError[];
}

export interface FileTreeContextProps {

  fileTree: FileTreeData;

  expandedFolders: Set<string>;


  selectedFile?: FileNode;

  focusedNode?: FileNode;

  onToggleFolder: (folderId: string) => void;

  onSelectFile: (fileId: string) => void;
  onSetFocus: (nodeId: string) => void;
}

export interface ThemeConfig {

  name: string;

  isDark: boolean;

  colors?: Record<string, string>;
}

export interface UserPreferences {

  defaultViewMode: 'grid' | 'list';

  showKeyboardShortcuts: boolean;

  autoExpandOnSearch: boolean;

  maxRecentFiles: number;

  theme: ThemeConfig;
}