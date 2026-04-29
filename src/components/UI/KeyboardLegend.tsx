import React from 'react';
import './KeyboardLegend.css';

export function KeyboardLegend() {
  return (
    <div className="keyboard-legend">
      <div className="keyboard-legend__title">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="6" y1="16" x2="6" y2="16"></line><line x1="10" y1="16" x2="14" y2="16"></line><line x1="18" y1="16" x2="18" y2="16"></line></svg>
        KEYBOARD EXPLORER
      </div>
      <div className="keyboard-legend__grid">
        <div className="keyboard-legend__item">
          <kbd>↑↓</kbd>
          <span>Navigate</span>
        </div>
        <div className="keyboard-legend__item">
          <kbd>→</kbd>
          <span>Expand</span>
        </div>
        <div className="keyboard-legend__item">
          <kbd>↵</kbd>
          <span>Select</span>
        </div>
        <div className="keyboard-legend__item">
          <kbd>⌘K</kbd>
          <span>Search</span>
        </div>
      </div>
      <div className="keyboard-legend__footer">
        <span className="keyboard-legend__esc">ESC TO DISMISS</span>
        <span className="keyboard-legend__dots">...</span>
      </div>
    </div>
  );
}
