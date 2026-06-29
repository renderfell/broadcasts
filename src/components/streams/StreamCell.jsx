import { memo, useCallback, useState } from 'react';

export const StreamCell = memo(function StreamCell({ stream, index }) {
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
    return (
      <div className="stream-cell stream-cell-empty">
        <div className="stream-empty-content">
          <div className="stream-empty-icon">＋</div>
          <div className="stream-empty-main">Empty</div>
          <div className="stream-empty-hint">Open menu to add streams</div>
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
