import React from 'react';
import {
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  CornerDownLeft, Command, Keyboard,
} from 'lucide-react';
import { useVaultState } from '../../context/VaultContext';
import './KeyboardLegend.css';

export function KeyboardLegend() {
  const { hasUsedKeyboard } = useVaultState();

  return (
    <div
      className={`keyboard-legend ${hasUsedKeyboard ? 'keyboard-legend--visible' : ''}`}
      aria-hidden="true"
    >
      <div className="keyboard-legend__title">
        <Keyboard size={12} />
        Keyboard shortcuts
      </div>
      <ul className="keyboard-legend__list">
        <li>
          <span className="keyboard-legend__keys">
            <kbd><ArrowUp size={10} /></kbd>
            <kbd><ArrowDown size={10} /></kbd>
          </span>
          Navigate
        </li>
        <li>
          <span className="keyboard-legend__keys">
            <kbd><ArrowRight size={10} /></kbd>
            <kbd><ArrowLeft size={10} /></kbd>
          </span>
          Expand / Collapse
        </li>
        <li>
          <span className="keyboard-legend__keys">
            <kbd><CornerDownLeft size={10} /></kbd>
          </span>
          Select / Toggle
        </li>
        <li>
          <span className="keyboard-legend__keys">
            <kbd><Command size={10} /></kbd>
            <kbd>K</kbd>
          </span>
          Search
        </li>
        <li>
          <span className="keyboard-legend__keys">
            <kbd>Esc</kbd>
          </span>
          Deselect
        </li>
      </ul>
    </div>
  );
}
