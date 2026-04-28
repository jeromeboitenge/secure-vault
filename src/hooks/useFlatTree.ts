import { useMemo } from 'react';
import type { FileNode } from '../context/VaultContext';

export interface FlatNode {
  node: FileNode;
  depth: number;
  parentId: string | null;
}

/**
 * Flattens the visible tree into an ordered array for keyboard traversal.
 * A folder's children are only included if the folder is in expandedFolders.
 */
function flattenTree(
  node: FileNode,
  expandedFolders: Set<string>,
  depth: number,
  parentId: string | null,
  result: FlatNode[]
): void {
  result.push({ node, depth, parentId });
  if (node.type === 'folder' && node.children && expandedFolders.has(node.id)) {
    for (const child of node.children) {
      flattenTree(child, expandedFolders, depth + 1, node.id, result);
    }
  }
}

export function useFlatTree(
  rootNode: FileNode,
  expandedFolders: Set<string>
): FlatNode[] {
  return useMemo(() => {
    const result: FlatNode[] = [];
    // Skip the root node itself in the flat list — start from its children
    if (rootNode.children && expandedFolders.has(rootNode.id)) {
      for (const child of rootNode.children) {
        flattenTree(child, expandedFolders, 0, rootNode.id, result);
      }
    }
    return result;
  }, [rootNode, expandedFolders]);
}

/**
 * Finds parent IDs for a given node ID — used to expand ancestors.
 * Returns array of ancestor IDs from root down to the direct parent.
 */
export function findAncestorIds(
  rootNode: FileNode,
  targetId: string,
  ancestors: string[] = []
): string[] | null {
  if (rootNode.id === targetId) return ancestors;
  if (rootNode.children) {
    for (const child of rootNode.children) {
      const result = findAncestorIds(child, targetId, [...ancestors, rootNode.id]);
      if (result) return result;
    }
  }
  return null;
}

/**
 * Finds a node by id anywhere in the tree.
 */
export function findNodeById(root: FileNode, id: string): FileNode | null {
  if (root.id === id) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Build breadcrumb path from root to a given node.
 */
export function buildBreadcrumb(root: FileNode, targetId: string): FileNode[] {
  function dfs(node: FileNode, path: FileNode[]): FileNode[] | null {
    const newPath = [...path, node];
    if (node.id === targetId) return newPath;
    if (node.children) {
      for (const child of node.children) {
        const result = dfs(child, newPath);
        if (result) return result;
      }
    }
    return null;
  }
  return dfs(root, []) ?? [root];
}
