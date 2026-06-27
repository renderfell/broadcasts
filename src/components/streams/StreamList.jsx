import { useStreamDrag } from '@/hooks/useStreamDrag';

import { DragHandle } from '@/components/ui/DragHandle';

export function StreamList({ streams, onStreamsChange }) {
  const { overIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useStreamDrag(
    streams,
    onStreamsChange
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
        </li>
      ))}
    </ul>
  );
}
