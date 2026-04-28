# SecureVault — Enterprise File Explorer

A pixel-perfect, production-grade file explorer built for law firms and banks.
Inspired by Linear's design quality — every detail counts.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Design Reference

This application was built referencing the Google Stitch design project:
**[https://stitch.withgoogle.com/projects/9565744590255196194](https://stitch.withgoogle.com/projects/9565744590255196194)**

---

## Tech Stack

| Concern      | Choice                             |
|--------------|------------------------------------|
| Framework    | React 18 + Vite                    |
| Language     | TypeScript (strict mode)           |
| Styling      | Vanilla CSS + CSS Custom Properties|
| State        | React Context + useReducer         |
| Icons        | Lucide React                       |
| Fonts        | Inter + JetBrains Mono via @fontsource |

---

## Architecture

### Recursive Tree Strategy

The file tree handles arbitrary nesting depth using a single recursive component:

```
FileTree.tsx           ← Entry point, reads root from data.json
  └── FileTreeNode.tsx ← Recursively renders itself for children
```

`FileTreeNode` receives a `node` prop. When `node.type === 'folder'`, it renders a `<ul role="group">` of child nodes, each of which is another `FileTreeNode`. The component is wrapped in `React.memo` so sibling node state changes don't cause unnecessary re-renders.

Expand/collapse state is a `Set<string>` of expanded folder IDs stored in `VaultContext`. A `max-height` CSS transition handles the smooth open/close animation without any JS animation libraries.

### State Architecture

To avoid unnecessary re-renders, `VaultContext` is split into two separate contexts:

- **`VaultStateContext`** — consumers re-render when state changes
- **`VaultDispatchContext`** — consumers that only dispatch never re-render

### Keyboard Navigation

All keyboard logic lives in `useKeyboardNav.ts`. The tree container has `tabIndex={0}` and listens for `keydown` events.

`useFlatTree.ts` flattens the currently *visible* tree (only expanded folder children) into an ordered array. Arrow keys move `focusedNodeId` through this flat array. The flat array is recomputed via `useMemo` whenever `expandedFolders` changes.

---

## Wildcard Feature: Command Palette (⌘K)

Enterprise users managing thousands of files can't afford to manually traverse a tree. The **⌘K command palette** provides instant access to any file or folder.

**How it works:**
1. `useSearch.ts` recursively walks the entire tree, collecting matches (case-insensitive substring)
2. Results are grouped: folders first, then files
3. Each result shows the matched substring bolded in blue and the full path in mono text
4. Selecting a result expands all ancestor folders, selects/navigates to the item, and scrolls the tree to show it
5. When the query is empty, the palette shows recent top-level folders as quick picks

**Why this matters:**
- Linear, Notion, Figma, and Raycast have all made ⌘K table-stakes for power users
- This is the feature an enterprise client will notice immediately and remember

---

## Features Checklist

- [x] Recursive tree — handles any nesting depth
- [x] Expand/collapse with smooth CSS animation
- [x] File selection → Properties Panel slides in (250ms)
- [x] Properties Panel: icon, name, type badge, size, modified, owner, AES-256 badge
- [x] Download / Share / Delete action buttons
- [x] Keyboard: ↑↓ through visible items only
- [x] Keyboard: → expands, ← collapses folders
- [x] Keyboard: Enter selects / toggles
- [x] Keyboard: ⌘K opens command palette
- [x] Keyboard legend card (fades in on first key press, disappears after 4s)
- [x] Command palette: search, ↑↓/Enter/Esc, grouped results, highlighted matches
- [x] Command palette: selects → expands ancestors + scrolls tree
- [x] Command palette: recent items shown when query is empty
- [x] Inline tree search filter: dims non-matches, auto-expands folders with matches
- [x] Inline tree search: highlights matched substring in blue
- [x] Breadcrumb updates on every navigation
- [x] Encrypted badge (lock icon) on files with `encrypted: true`
- [x] AES-256 badge in sidebar header and Properties Panel
- [x] Mobile: bottom sheet for Properties Panel, stacked layout
- [x] Custom scrollbars — 4px, token colors
- [x] CSS tokens used everywhere — zero hardcoded hex colors in components
- [x] ARIA roles: tree, treeitem, dialog, listbox, live regions
- [x] WCAG AA color contrast on all text
- [x] React.memo on FileTreeNode and FileCard
- [x] useMemo on useFlatTree and useSearch
- [x] Split state/dispatch contexts for perf

---

## Project Structure

```
src/
├── components/
│   ├── Breadcrumb/      Breadcrumb.tsx + .css
│   ├── FileGrid/        FileGrid.tsx, FileCard.tsx + .css
│   ├── FileTree/        FileTree.tsx, FileTreeNode.tsx + .css
│   ├── PropertiesPanel/ PropertiesPanel.tsx + .css
│   ├── SearchBar/       SearchBar.tsx (command palette) + .css
│   └── UI/              Badge, Button, Divider, Tooltip, KeyboardLegend
├── context/             VaultContext.tsx
├── data/                data.json
├── hooks/               useFlatTree.ts, useKeyboardNav.ts, useSearch.ts
└── styles/              tokens.css, reset.css, global.css
```
