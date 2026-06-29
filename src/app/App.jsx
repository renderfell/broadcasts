import { useEffect, useState } from 'react';

import initialStreams from '@/data/turkish.json';

import { Sidebar } from '@/components/layout/Sidebar';
import { StreamGrid } from '@/components/streams/StreamGrid';

const LAYOUT_KEY = 'broadcasts:layout';
const STREAMS_KEY = 'broadcasts:streams';

const storage = typeof window !== 'undefined' ? window.localStorage : null;

function loadInitialLayout() {
  try {
    const saved = storage?.getItem(LAYOUT_KEY);
    return saved || '3x3';
  } catch {
    return '3x3';
  }
}

function loadInitialStreams() {
  try {
    const saved = storage?.getItem(STREAMS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return initialStreams;
}

export default function App() {
  const [layout, setLayout] = useState(loadInitialLayout);
  const [streams, setStreams] = useState(loadInitialStreams);

  // Persist layout
  useEffect(() => {
    try {
      storage?.setItem(LAYOUT_KEY, layout);
    } catch {
      // localStorage may be unavailable
    }
  }, [layout]);

  // Persist streams
  useEffect(() => {
    try {
      storage?.setItem(STREAMS_KEY, JSON.stringify(streams));
    } catch {
      // localStorage may be unavailable
    }
  }, [streams]);

  function handleAddStream(stream) {
    if (!stream?.id) return;
    setStreams((prev) => [...prev, stream]);
  }

  function handleRemoveStream(index) {
    setStreams((prev) => prev.filter((_, i) => i !== index));
  }

  function handleResetStreams() {
    setStreams(initialStreams);
  }

  return (
    <div className="app">
      <StreamGrid streams={streams} layout={layout} />
      <Sidebar
        layout={layout}
        onLayoutChange={setLayout}
        streams={streams}
        onStreamsChange={setStreams}
        onAddStream={handleAddStream}
        onRemoveStream={handleRemoveStream}
        onResetStreams={handleResetStreams}
      />
    </div>
  );
}
