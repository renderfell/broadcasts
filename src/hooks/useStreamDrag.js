import { useRef, useState } from 'react';

export function useStreamDrag(streams, onStreamsChange) {
  const dragIndex = useRef(null);
  const [overIndex, setOverIndex] = useState(null);

  function handleDragStart(i) {
    dragIndex.current = i;
  }

  function handleDragOver(e, i) {
    e.preventDefault();
    setOverIndex(i);
  }

  function handleDrop(e, i) {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === i) {
      setOverIndex(null);
      return;
    }
    const next = [...streams];
    const [item] = next.splice(from, 1);
    next.splice(i, 0, item);
    onStreamsChange(next);
    dragIndex.current = null;
    setOverIndex(null);
  }

  function handleDragEnd() {
    dragIndex.current = null;
    setOverIndex(null);
  }

  return {
    overIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
