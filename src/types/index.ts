/**
 * Core TypeScript Interfaces for SecureVault File Explorer
 * 
 * This file contains all the essential data models and type definitions
 * used throughout the application. Each interface is designed to be
 * self-documenting and easy to understand.
 */

/**
 * Represents a single file or folder in the file system
 * This is the core building block of our file tree structure
 */
export interface FileNode {
  /** Unique identifier for this file or folder */
  id: string;
  
  /** Display name of the file or folder */
  name: string;
  
  /** Type determines if this is a file or folder */
  type: 'file' | 'folder';
  
  // File-specific properties (only present when type is 'file')
  /** File extension or type (e.g., 'pdf', 'docx', 'jpg') */
  fileType?: string;
  
  /** File size in bytes */
  size?: number;
  
  /** When the file was last modified */
  modified?: Date;
  
  /** Who owns or created this file */
  owner?: string;
  
  /** Whether this file is encrypted (shows green badge) */
  encrypted?: boolean;
  
  // Folder-specific properties (only present when type is 'folder')
  /** Child files and folders (only for folders) */
  children?: FileNode[];
  
  // Computed properties (calculated by the application)
  /** Full path from root to this item */
  path?: string[];
  
  /** How deep this item is nested (0 = root level) */
  depth?: number;
}

/**
 * The complete file tree data structure
 * Contains the root folder and metadata about the entire tree
 */
export interface FileTreeData {
  /** The root folder containing all files and subfolders */
  root: FileNode;
  
  /** Total number of files in the entire tree */
  totalFiles: number;
  
  /** Total size of all files combined (in bytes) */
  totalSize: number;
  
  /** When any file in the tree was last modified */
  lastModified: Date;
}

/**
 * Represents a single item in the breadcrumb navigation
 * Shows the path from root to current location
 */
export interface BreadcrumbItem {
  /** Unique identifier matching a folder's ID */
  id: string;
  
  /** Display name for this breadcrumb item */
  name: string;
  
  /** Full path to this location */
  path: string[];
}

/**
 * The complete application state
 * Contains all the data needed to render the UI
 */
export interface VaultState {
  // Core data
  /** The complete file tree structure */
  fileTree: FileTreeData;
  
  // Tree interaction state
  /** Set of folder IDs that are currently expanded */
  expandedFolders: Set<string>;
  
  // Selection and focus state
  /** ID of the currently selected file (if any) */
  selectedFileId?: string;
  
  /** ID of the item that currently has keyboard focus */
  focusedNodeId?: string;
  
  // UI state
  /** Whether the properties panel is currently visible */
  propertiesPanelOpen: boolean;
  
  /** Whether the command palette search is open */
  commandPaletteOpen: boolean;
  
  /** Current search query for filtering the tree */
  searchQuery: string;
  
  /** How files are displayed in the main area */
  viewMode: 'grid' | 'list';
  
  // Navigation state
  /** Current folder path as array of folder names */
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
  
  // Navigation actions
  | { type: 'NAVIGATE_TO_PATH'; payload: { path: string[] } }
  | { type: 'UPDATE_BREADCRUMB'; payload: { breadcrumb: BreadcrumbItem[] } }
  
  // Keyboard navigation actions
  | { type: 'SHOW_KEYBOARD_LEGEND' }
  | { type: 'HIDE_KEYBOARD_LEGEND' }
  | { type: 'ADD_RECENT_FILE'; payload: { file: FileNode } };

/**
 * Search result item with additional context
 * Used when displaying search results in the command palette
 */
export interface SearchResult {
  /** The file or folder that matches the search */
  node: FileNode;
  
  /** Full path to this item for display */
  path: string[];
  
  /** The search query that matched this item */
  matchedQuery: string;
  
  /** Type of match (name, path, content, etc.) */
  matchType: 'name' | 'path' | 'owner' | 'type';
}

/**
 * Configuration for keyboard shortcuts
 * Makes it easy to customize or display shortcuts
 */
export interface KeyboardShortcut {
  /** Keys to press (e.g., ['Cmd', 'K'] or ['ArrowUp']) */
  keys: string[];
  
  /** What this shortcut does */
  description: string;
  
  /** Category for grouping shortcuts */
  category: 'navigation' | 'search' | 'selection' | 'general';
}

/**
 * Error types that can occur in the application
 * Helps with proper error handling and user feedback
 */
export interface VaultError {
  /** Unique error code for programmatic handling */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Additional context about the error */
  details?: Record<string, any>;
  
  /** When the error occurred */
  timestamp: Date;
}

/**
 * Validation result for file tree data
 * Used to ensure data integrity before rendering
 */
export interface ValidationResult {
  /** Whether the data is valid */
  isValid: boolean;
  
  /** List of validation errors (if any) */
  errors: VaultError[];
  
  /** List of warnings (non-critical issues) */
  warnings: VaultError[];
}

/**
 * Props for components that need file tree context
 * Common interface for components that work with files
 */
export interface FileTreeContextProps {
  /** Current file tree data */
  fileTree: FileTreeData;
  
  /** Currently expanded folders */
  expandedFolders: Set<string>;
  
  /** Currently selected file */
  selectedFile?: FileNode;
  
  /** Currently focused item */
  focusedNode?: FileNode;
  
  /** Function to toggle folder expansion */
  onToggleFolder: (folderId: string) => void;
  
  /** Function to select a file */
  onSelectFile: (fileId: string) => void;
  
  /** Function to set keyboard focus */
  onSetFocus: (nodeId: string) => void;
}

/**
 * Theme configuration
 * Allows for future theme customization
 */
export interface ThemeConfig {
  /** Theme name */
  name: string;
  
  /** Whether this is a dark theme */
  isDark: boolean;
  
  /** Custom color overrides */
  colors?: Record<string, string>;
}

/**
 * User preferences that can be saved
 * Allows users to customize their experience
 */
export interface UserPreferences {
  /** Preferred view mode */
  defaultViewMode: 'grid' | 'list';
  
  /** Whether to show keyboard shortcuts */
  showKeyboardShortcuts: boolean;
  
  /** Whether to auto-expand folders during search */
  autoExpandOnSearch: boolean;
  
  /** Maximum number of recent files to remember */
  maxRecentFiles: number;
  
  /** Theme preference */
  theme: ThemeConfig;
}