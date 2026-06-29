import { useCallback, useState } from 'react';

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
  presets = [],
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  isOpen,
  onClose,
}) {
  const [newStreamInput, setNewStreamInput] = useState('');
  const [newStreamName, setNewStreamName] = useState('');
  const [addError, setAddError] = useState('');
  const [presetName, setPresetName] = useState('');

  const handleLayoutSelect = useCallback(
    (e) => {
      const value = e.currentTarget.dataset['value'];
      if (value) {
        onLayoutChange(value);
        onClose();
      }
    },
    [onLayoutChange, onClose]
  );

  const handleStreamInputChange = useCallback((e) => {
    setNewStreamInput(e.target.value);
    setAddError('');
  }, []);

  const handleStreamNameChange = useCallback((e) => {
    setNewStreamName(e.target.value);
    setAddError('');
  }, []);

  const handleAddStream = useCallback(
    (e) => {
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

      const channel = newStreamName.trim() || 'Custom';
      onAddStream?.({ id, channel });
      setNewStreamInput('');
      setNewStreamName('');
    },
    [newStreamInput, newStreamName, streams, onAddStream]
  );

  const handleReset = useCallback(() => {
    if (typeof window !== 'undefined' && window.confirm('Reset streams to the original list?')) {
      onResetStreams?.();
    }
  }, [onResetStreams]);

  const handleSavePresetSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (presetName.trim() && onSavePreset) {
        onSavePreset(presetName.trim());
        setPresetName('');
      }
    },
    [presetName, onSavePreset]
  );

  const handlePresetNameChange = useCallback((e) => {
    setPresetName(e.target.value);
  }, []);

  const handleLoad = useCallback(
    (preset) => {
      onLoadPreset?.(preset);
      onClose();
    },
    [onLoadPreset, onClose]
  );

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
              <div className="add-stream-row">
                <input
                  type="text"
                  className="add-stream-input"
                  placeholder="YouTube ID or URL (e.g. dQw4w9wgxcQ)"
                  value={newStreamInput}
                  onChange={handleStreamInputChange}
                />
                <button type="submit" className="add-stream-btn">
                  Add
                </button>
              </div>

              <input
                type="text"
                className="add-stream-name-input"
                placeholder="Name (optional)"
                value={newStreamName}
                onChange={handleStreamNameChange}
              />

              {addError && <div className="add-stream-error">{addError}</div>}
            </form>
          )}
        </section>

        {onSavePreset && (
          <section className="menu-section">
            <p className="menu-label">PRESETS</p>
            <form className="preset-form" onSubmit={handleSavePresetSubmit}>
              <input
                type="text"
                className="preset-input"
                placeholder="Preset name"
                value={presetName}
                onChange={handlePresetNameChange}
              />
              <button type="submit" className="preset-btn" disabled={!presetName.trim()}>
                Save
              </button>
            </form>
            {presets.length > 0 && (
              <ul className="preset-list">
                {presets.map((preset) => (
                  <li key={preset.id} className="preset-item">
                    <button
                      className="preset-load"
                      onClick={() => handleLoad(preset)}
                      title={`Load ${preset.name}`}
                    >
                      {preset.name}
                    </button>
                    <button
                      className="preset-delete"
                      onClick={() => onDeletePreset?.(preset.id)}
                      title="Delete preset"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {isOpen && <div className="menu-backdrop" onClick={onClose} />}
    </>
  );
}
