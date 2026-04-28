import { useEffect, useRef, useCallback } from 'react';
import type { FileNode } from '../context/VaultContext';
import { useVaultState, useVaultDispatch } from '../context/VaultContext';
import type { FlatNode } from './useFlatTree';
import { buildBreadcrumb } from './useFlatTree';

interface UseKeyboardNavOptions {
  flatTree: FlatNode[];
  rootNode: FileNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useKeyboardNav({ flatTree, rootNode, containerRef }: UseKeyboardNavOptions) {
  const { focusedNodeId, expandedFolders, hasUsedKeyboard } = useVaultState();
  const dispatch = useVaultDispatch();

  // We track whether the keyboard legend timer is running
  const legendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showKeyboardLegend = useCallback(() => {
    if (!hasUsedKeyboard) {
      dispatch({ type: 'SET_HAS_USED_KEYBOARD', payload: true });
    }
    if (legendTimerRef.current) clearTimeout(legendTimerRef.current);
    legendTimerRef.current = setTimeout(() => {
      dispatch({ type: 'SET_HAS_USED_KEYBOARD', payload: false });
    }, 4000);
  }, [dispatch, hasUsedKeyboard]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      // Don't intercept typing in inputs
      if (tag === 'input' || tag === 'textarea') return;

      const isMeta = e.metaKey || e.ctrlKey;

      // ⌘K / Ctrl+K — open command palette
      if (isMeta && e.key === 'k') {
        e.preventDefault();
        dispatch({ type: 'SET_COMMAND_PALETTE', payload: true });
        return;
      }

      const flat = flatTree;
      const currentIndex = flat.findIndex((n) => n.node.id === focusedNodeId);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          showKeyboardLegend();
          const nextIdx = currentIndex < flat.length - 1 ? currentIndex + 1 : 0;
          const nextNode = flat[nextIdx];
          if (nextNode) {
            dispatch({ type: 'SET_FOCUSED_NODE', payload: nextNode.node.id });
            scrollNodeIntoView(nextNode.node.id);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          showKeyboardLegend();
          const prevIdx = currentIndex > 0 ? currentIndex - 1 : flat.length - 1;
          const prevNode = flat[prevIdx];
          if (prevNode) {
            dispatch({ type: 'SET_FOCUSED_NODE', payload: prevNode.node.id });
            scrollNodeIntoView(prevNode.node.id);
          }
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          showKeyboardLegend();
          const rightNode = flat[currentIndex];
          if (rightNode?.node.type === 'folder') {
            dispatch({ type: 'EXPAND_FOLDER', payload: rightNode.node.id });
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          showKeyboardLegend();
          const leftNode = flat[currentIndex];
          if (!leftNode) break;
          if (leftNode.node.type === 'folder' && expandedFolders.has(leftNode.node.id)) {
            dispatch({ type: 'COLLAPSE_FOLDER', payload: leftNode.node.id });
          } else if (leftNode.parentId) {
            // Move focus to parent
            dispatch({ type: 'SET_FOCUSED_NODE', payload: leftNode.parentId });
            scrollNodeIntoView(leftNode.parentId);
          }
          break;
        }
        case 'Enter': {
          e.preventDefault();
          showKeyboardLegend();
          const enterNode = flat[currentIndex];
          if (!enterNode) break;
          if (enterNode.node.type === 'folder') {
            dispatch({ type: 'TOGGLE_FOLDER', payload: enterNode.node.id });
          } else {
            dispatch({ type: 'SELECT_FILE', payload: enterNode.node });
            const crumb = buildBreadcrumb(rootNode, enterNode.node.id);
            dispatch({ type: 'SET_BREADCRUMB_PATH', payload: crumb });
          }
          break;
        }
        case 'Escape': {
          dispatch({ type: 'SELECT_FILE', payload: null });
          dispatch({ type: 'SET_FOCUSED_NODE', payload: null });
          break;
        }
        default:
          return;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [
    flatTree,
    focusedNodeId,
    expandedFolders,
    dispatch,
    showKeyboardLegend,
    rootNode,
    containerRef,
  ]);

  return null;
}

function scrollNodeIntoView(nodeId: string) {
  requestAnimationFrame(() => {
    const el = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}
