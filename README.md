# SecureVault File Explorer

A modern, high-performance "File Explorer" UI built for enterprise cloud security.

## Design Link
[View Design File (Figma)](#) *(Link would go here)*

## Setup Instructions
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open `http://localhost:5174/` in your browser.

## Architecture & Recursive Strategy
The application manages complex nested file structures without performance degradation using a carefully designed recursive strategy:

1. **State Management**: We use a central `VaultContext` with `useReducer` to maintain UI state (expanded folders, selected items, current grid folder, breadcrumb path).
2. **Recursive Rendering (Sidebar)**: The `FileTree` component recursively calls `renderNode` for every item in `data.json`. However, to optimize rendering, it **only** renders children if their parent folder is currently expanded in the state. This keeps the DOM lean, allowing it to handle 20+ levels easily.
3. **Flat Tree Mapping (Keyboard Nav)**: For the keyboard accessibility (Up/Down navigation), we generate a "Flat Tree" on the fly using `useFlatTree.ts`. It walks the recursive structure and flattens only the currently visible nodes into a 1D array. This turns complex 2D tree traversal into a simple `O(1)` array index lookup for arrow keys.
4. **Grid View Navigation**: The main grid `FileGrid` reads the `currentFolderId` from state and selectively renders only the direct children of that specific node, providing a classic desktop-style file explorer experience.

## The Wildcard Feature: Desktop-Class Navigation & Breadcrumbs
While the original requirements asked for a simple list or tree, I recognized that law firm employees managing complex case files need a true **Desktop File Explorer** experience. 

Therefore, I implemented **Breadcrumb Navigation and Grid View Routing** as my Wildcard Feature.
- **Why it matters**: A pure sidebar tree is too cramped for deep nesting. Users need a large grid area to scan multiple files quickly.
- **Value**: By clicking folders in the grid, the view drills down into that directory, updating a clickable breadcrumb trail at the top. This significantly reduces cognitive load and mimics native OS behavior (Windows Explorer / macOS Finder), reducing the learning curve for enterprise clients and making them much faster at retrieving case files.

## Bonus Feature: Command Palette Search
A globally accessible command palette (`Ctrl+K` or `⌘K`) allows users to instantly search the entire vault. Matches are highlighted, and clicking a result automatically expands all necessary parent folders in the tree and navigates the grid view to exactly where the file lives.
