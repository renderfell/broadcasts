import { useCallback, useEffect, useState } from 'react';

import initialStreams from '@/data/turkish.json';

import { Sidebar } from '@/components/layout/Sidebar';
import { StreamGrid } from '@/components/streams/StreamGrid';

const LAYOUT_KEY = 'broadcasts:layout';
const STREAMS_KEY = 'broadcasts:streams';
const PRESETS_KEY = 'broadcasts:presets';

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

function loadInitialPresets() {
  try {
    const saved = storage?.getItem(PRESETS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [layout, setLayout] = useState(loadInitialLayout);
  const [streams, setStreams] = useState(loadInitialStreams);
  const [presets, setPresets] = useState(loadInitialPresets);
  const [assignTarget, setAssignTarget] = useState(null);

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

  // Persist presets
  useEffect(() => {
    try {
      storage?.setItem(PRESETS_KEY, JSON.stringify(presets));
    } catch {
      // localStorage may be unavailable
    }
  }, [presets]);

  const handleAddStream = useCallback((stream) => {
    if (!stream?.id) return;
    setStreams((prev) => [...prev, stream]);
  }, []);

  const handleRemoveStream = useCallback((index) => {
    setStreams((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleResetStreams = useCallback(() => {
    setStreams(initialStreams);
  }, []);

  const handleSavePreset = useCallback(
    (name) => {
      if (!name || !name.trim()) return;
      const newPreset = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: name.trim(),
        layout,
        streams: [...streams],
      };
      setPresets((prev) => [...prev, newPreset]);
    },
    [layout, streams]
  );

  const handleLoadPreset = useCallback((preset) => {
    setLayout(preset.layout);
    setStreams(preset.streams);
  }, []);

  const handleDeletePreset = useCallback((id) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleAssignToSlot = useCallback((slotIndex) => {
    setAssignTarget(slotIndex);
  }, []);

  const handleAssignStream = useCallback(
    (fromIndex) => {
      if (assignTarget === null || fromIndex === assignTarget) {
        setAssignTarget(null);
        return;
      }
      const newStreams = [...streams];
      const [item] = newStreams.splice(fromIndex, 1);
      newStreams.splice(assignTarget, 0, item);
      setStreams(newStreams);
      setAssignTarget(null);
    },
    [assignTarget, streams]
  );

  const handleCancelAssign = useCallback(() => {
    setAssignTarget(null);
  }, []);

  return (
    <div className="app">
      <StreamGrid
        streams={streams}
        layout={layout}
        assignTarget={assignTarget}
        onAssignToSlot={handleAssignToSlot}
        onCancelAssign={handleCancelAssign}
      />
      <Sidebar
        layout={layout}
        onLayoutChange={setLayout}
        streams={streams}
        onStreamsChange={setStreams}
        onAddStream={handleAddStream}
        onRemoveStream={handleRemoveStream}
        onResetStreams={handleResetStreams}
        presets={presets}
        onSavePreset={handleSavePreset}
        onLoadPreset={handleLoadPreset}
        onDeletePreset={handleDeletePreset}
        assignTarget={assignTarget}
        onAssignStream={handleAssignStream}
        onCancelAssign={handleCancelAssign}
      />
    </div>
  );
}
