import { useState } from 'react';

import { LAYOUT_OPTIONS } from '@/constants/layouts';

import { StreamList } from '@/components/streams/StreamList';

import { extractYouTubeId } from '@/utils/extractYouTubeId';

export function Menu({
  layout,
  onLayoutChange,
  streams,
  onStreamsChange,
  onAddStream,
  onRemoveStream,
  onResetStreams,
  isOpen,
  onClose,
}) {
  const [newStreamInput, setNewStreamInput] = useState('');
  const [addError, setAddError] = useState('');

  function handleLayoutSelect(e) {
    const value = e.currentTarget.dataset['value'];
    if (value) {
      onLayoutChange(value);
      onClose();
    }
  }

  function handleAddStream(e) {
    e.preventDefault();
    setAddError('');

    const id = extractYouTubeId(newStreamInput);
    if (!id) {
      setAddError('Please enter a valid YouTube video ID or URL');
      return;
    }

    // Prevent obvious duplicates by ID
    if (streams.some((s) => s.id === id)) {
      setAddError('This stream is already in the list');
      return;
    }

    onAddStream?.({ id, channel: 'Custom' });
    setNewStreamInput('');
  }

  function handleReset() {
    if (typeof window !== 'undefined' && window.confirm('Reset streams to the original list?')) {
      onResetStreams?.();
    }
  }

  return (
    <>
      <div className={`menu-panel ${isOpen ? 'open' : ''}`}>
        {LAYOUT_OPTIONS.length > 1 && (
          <section className="menu-section">
            <p className="menu-label">GRID</p>
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
          <div className="streams-header">
            <p className="menu-label">STREAMS</p>
            {onResetStreams && (
              <button className="reset-btn" onClick={handleReset} title="Reset to defaults">
                Reset
              </button>
            )}
          </div>

          <StreamList
            streams={streams}
            onStreamsChange={onStreamsChange}
            onRemoveStream={onRemoveStream}
          />

          {onAddStream && (
            <form className="add-stream-form" onSubmit={handleAddStream}>
              <input
                type="text"
                className="add-stream-input"
                placeholder="YouTube ID or URL (e.g. dQw4w9wgxcQ)"
                value={newStreamInput}
                onChange={(e) => {
                  setNewStreamInput(e.target.value);
                  setAddError('');
                }}
              />
              <button type="submit" className="add-stream-btn">
                Add
              </button>
              {addError && <div className="add-stream-error">{addError}</div>}
            </form>
          )}
        </section>
      </div>

      {isOpen && <div className="menu-backdrop" onClick={onClose} />}
    </>
  );
}
