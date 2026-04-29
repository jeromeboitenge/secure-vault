import { ArrowUp, ArrowDown, CornerDownLeft, Clock } from './Icons';
import './KeyboardLegend.css';

export function KeyboardLegend() {
  return (
    <div className="keyboard-legend" role="list" aria-label="Keyboard shortcuts">
      <div className="keyboard-legend__group">
        <div className="keyboard-legend__item" role="listitem">
          <kbd><ArrowUp size={10} /></kbd>
          <kbd><ArrowDown size={10} /></kbd>
          <span>Navigate</span>
        </div>
        <div className="keyboard-legend__item" role="listitem">
          <kbd><CornerDownLeft size={10} /></kbd>
          <span>Select</span>
        </div>
        <div className="keyboard-legend__item" role="listitem">
          <kbd>Esc</kbd>
          <span>Close</span>
        </div>
        <div className="keyboard-legend__item" role="listitem">
          <Clock size={11} />
          <span>Recent</span>
        </div>
      </div>
    </div>
  );
}
