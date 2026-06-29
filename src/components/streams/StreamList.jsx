import { memo, useCallback } from 'react';

import { useStreamDrag } from '@/hooks/useStreamDrag';

import { DragHandle } from '@/components/ui/DragHandle';

export const StreamList = memo(function StreamList({
  streams,
  onStreamsChange,
  onRemoveStream,
  assignTarget,
  onAssignStream,
}) {
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

  const handleItemClick = useCallback(
    (e, i) => {
      if (assignTarget !== null && onAssignStream) {
        onAssignStream(i);
      }
    },
    [assignTarget, onAssignStream]
  );

  return (
    <ul className="stream-list">
      {streams.map((stream, i) => (
        <li
          key={stream.id}
          className={`stream-item ${overIndex === i ? 'drag-over' : ''} ${assignTarget !== null ? 'assign-mode' : ''}`}
          draggable={assignTarget === null}
          onClick={(e) => handleItemClick(e, i)}
          onDragStart={() => assignTarget === null && handleDragStart(i)}
          onDragOver={(e) => assignTarget === null && handleDragOver(e, i)}
          onDrop={(e) => assignTarget === null && handleDrop(e, i)}
          onDragEnd={handleDragEnd}
        >
          <span className="stream-item-handle">
            <DragHandle />
          </span>
          <span className="stream-item-index">{i + 1}</span>
          <span className="stream-item-name">{stream.channel || stream.title || stream.id}</span>

          {onRemoveStream && assignTarget === null && (
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
