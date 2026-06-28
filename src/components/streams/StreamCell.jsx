import { useState } from 'react';

export function StreamCell({ stream, index }) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!stream) {
    return (
      <div className="stream-cell stream-cell-empty">
        <div className="stream-empty-content">
          <div className="stream-empty-icon">＋</div>
          <div className="stream-empty-main">Empty</div>
          <a
            href="https://github.com/renderfell/broadcasts"
            target="_blank"
            rel="noopener noreferrer"
            className="stream-empty-link"
            onClick={(e) => e.stopPropagation()}
          >
            Contribute on GitHub
          </a>
        </div>
      </div>
    );
  }

  const src = `https://www.youtube.com/embed/${stream.id}?autoplay=1&mute=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`;

  function handleLoad() {
    setIsLoaded(true);
  }

  return (
    <div className="stream-cell">
      {!isLoaded && (
        <div className="stream-loading">
          <div className="stream-spinner" />
        </div>
      )}
      <iframe
        src={src}
        title={stream.title || `Stream ${index + 1}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleLoad}
      />
      <div className="stream-label">{stream.channel || stream.title}</div>
    </div>
  );
}
