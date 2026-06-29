import { memo, useMemo } from 'react';

import { LAYOUTS } from '@/constants/layouts';

import { StreamCell } from '@/components/streams/StreamCell';

export const StreamGrid = memo(function StreamGrid({ streams, layout }) {
  const { cols, rows, count } = LAYOUTS[layout] ?? LAYOUTS['3x3'];

  const visible = useMemo(
    () => Array.from({ length: count }, (_, i) => streams[i] ?? null),
    [streams, count]
  );

  const gridStyle = useMemo(() => ({ '--cols': cols, '--rows': rows }), [cols, rows]);

  return (
    <div className="stream-grid" style={gridStyle}>
      {visible.map((stream, i) => (
        <StreamCell key={`${layout}-${i}`} stream={stream} index={i} />
      ))}
    </div>
  );
});
