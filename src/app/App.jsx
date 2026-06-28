import { useState } from 'react';

import initialStreams from '@/data/streams.json';

import { Sidebar } from '@/components/layout/Sidebar';
import { StreamGrid } from '@/components/streams/StreamGrid';

export default function App() {
  const [layout, setLayout] = useState('3x3');
  const [streams, setStreams] = useState(initialStreams);

  return (
    <div className="app">
      <StreamGrid streams={streams} layout={layout} />
      <Sidebar
        layout={layout}
        onLayoutChange={setLayout}
        streams={streams}
        onStreamsChange={setStreams}
      />
    </div>
  );
}
