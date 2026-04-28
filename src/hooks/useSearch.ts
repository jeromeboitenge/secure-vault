import { useMemo } from 'react';
import type { FileNode } from '../context/VaultContext';

export interface SearchResult {
  node: FileNode;
  path: FileNode[];
  matchStart: number;
  matchEnd: number;
}

/**
 * Recursively walks the tree collecting all nodes whose name
 * contains query (case-insensitive).
 */
function searchTree(
  node: FileNode,
  query: string,
  path: FileNode[],
  results: SearchResult[]
): void {
  const lowerName = node.name.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerName.indexOf(lowerQuery);

  if (idx !== -1) {
    results.push({
      node,
      path: [...path, node],
      matchStart: idx,
      matchEnd: idx + query.length,
    });
  }

  if (node.children) {
    for (const child of node.children) {
      searchTree(child, query, [...path, node], results);
    }
  }
}

export interface UseSearchResult {
  folderResults: SearchResult[];
  fileResults: SearchResult[];
  allResults: SearchResult[];
}

export function useSearch(
  rootNode: FileNode,
  query: string
): UseSearchResult {
  return useMemo(() => {
    if (!query.trim()) {
      return { folderResults: [], fileResults: [], allResults: [] };
    }
    const results: SearchResult[] = [];
    if (rootNode.children) {
      for (const child of rootNode.children) {
        searchTree(child, query, [rootNode], results);
      }
    }
    const folderResults = results.filter((r) => r.node.type === 'folder');
    const fileResults = results.filter((r) => r.node.type === 'file');
    return { folderResults, fileResults, allResults: results };
  }, [rootNode, query]);
}

/**
 * For inline tree search: checks if a node or any of its descendants
 * match the query. Returns true if this subtree should be visible.
 */
export function nodeOrDescendantMatches(node: FileNode, query: string): boolean {
  if (!query.trim()) return true;
  const lowerQuery = query.toLowerCase();
  if (node.name.toLowerCase().includes(lowerQuery)) return true;
  if (node.children) {
    return node.children.some((child) => nodeOrDescendantMatches(child, query));
  }
  return false;
}
