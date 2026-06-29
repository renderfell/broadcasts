import { memo, useCallback, useState } from 'react';

export const StreamCell = memo(function StreamCell({
  stream,
  index,
  assignTarget,
  onAssignToSlot,
  onCancelAssign,
}) {
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleReload = useCallback((e) => {
    e.stopPropagation();
    setIsLoaded(false);
    setReloadKey((k) => k + 1);
  }, []);

  if (!stream) {
    const isTarget = assignTarget === index;
    return (
      <div
        className={`stream-cell stream-cell-empty ${isTarget ? 'assign-target' : ''}`}
        onClick={() => onAssignToSlot && onAssignToSlot(index)}
        style={{ cursor: onAssignToSlot ? 'pointer' : 'default' }}
      >
        <div className="stream-empty-content">
          <div className="stream-empty-icon">＋</div>
          <div className="stream-empty-main">{isTarget ? 'Select stream' : 'Empty'}</div>
          <div className="stream-empty-hint">
            {isTarget ? 'Click a stream in the menu' : 'Click to assign'}
          </div>
          {isTarget && onCancelAssign && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelAssign();
              }}
              className="cancel-assign"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  const src = `https://www.youtube.com/embed/${stream.id}?autoplay=1&mute=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&t=${reloadKey}`;

  return (
    <div className="stream-cell">
      {!isLoaded && (
        <div className="stream-loading">
          <div className="stream-spinner" />
        </div>
      )}
      <iframe
        key={reloadKey}
        src={src}
        title={stream.title || `Stream ${index + 1}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleLoad}
      />
      <div className="stream-label">
        <span className="stream-label-text">{stream.channel || stream.title}</span>
        <button
          className="stream-reload-btn"
          onClick={handleReload}
          title="Reload stream"
          aria-label="Reload stream"
        >
          ↻
        </button>
      </div>
    </div>
  );
});
