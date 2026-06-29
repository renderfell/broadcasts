import { LAYOUT_OPTIONS } from '@/constants/layouts';

import { StreamList } from '@/components/streams/StreamList';

export function Menu({ layout, onLayoutChange, streams, onStreamsChange, isOpen, onClose }) {
  function handleLayoutSelect(e) {
    const value = e.currentTarget.dataset['value'];
    if (value) {
      onLayoutChange(value);
      onClose();
    }
  }

  return (
    <>
      <div className={`menu-panel ${isOpen ? 'open' : ''}`}>
        {LAYOUT_OPTIONS.length > 1 && (
          <section className="menu-section">
            <p className="menu-label">GRIDS</p>
            <div className="layout-options">
              {LAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-value={opt.value}
                  className={`layout-btn ${layout === opt.value ? 'active' : ''}`}
                  onClick={handleLayoutSelect}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="menu-section">
          <p className="menu-label">Streams</p>
          <StreamList streams={streams} onStreamsChange={onStreamsChange} />
        </section>
      </div>

      {isOpen && <div className="menu-backdrop" onClick={onClose} />}
    </>
  );
}
