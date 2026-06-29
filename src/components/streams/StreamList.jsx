import { memo, useCallback } from 'react';

import { useStreamDrag } from '@/hooks/useStreamDrag';

import { DragHandle } from '@/components/ui/DragHandle';

export const StreamList = memo(function StreamList({ streams, onStreamsChange, onRemoveStream }) {
  const { overIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useStreamDrag(
    streams,
    onStreamsChange
  );

  const handleRemove = useCallback(
    (e, i) => {
      e.stopPropagation();
      onRemoveStream(i);
    },
    [onRemoveStream]
  );

  return (
    <ul className="stream-list">
      {streams.map((stream, i) => (
        <li
          key={stream.id}
          className={`stream-item ${overIndex === i ? 'drag-over' : ''}`}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={(e) => handleDrop(e, i)}
          onDragEnd={handleDragEnd}
        >
          <span className="stream-item-handle">
            <DragHandle />
          </span>
          <span className="stream-item-index">{i + 1}</span>
          <span className="stream-item-name">{stream.channel || stream.title || stream.id}</span>

          {onRemoveStream && (
            <button
              className="stream-item-remove"
              onClick={(e) => handleRemove(e, i)}
              title="Remove stream"
              aria-label={`Remove ${stream.channel || stream.id}`}
            >
              ×
            </button>
          )}
        </li>
      ))}
    </ul>
  );
});
