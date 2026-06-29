import { useState } from 'react';

import { useFullscreen } from '@/hooks/useFullscreen';

import { Menu } from '@/components/layout/Menu';
import { CollapseIcon } from '@/components/ui/CollapseIcon';
import { ExpandIcon } from '@/components/ui/ExpandIcon';
import { MenuIcon } from '@/components/ui/MenuIcon';

export function Sidebar({
  layout,
  onLayoutChange,
  streams,
  onStreamsChange,
  onAddStream,
  onRemoveStream,
  onResetStreams,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  function handleMenuToggle() {
    setIsMenuOpen((open) => !open);
  }

  function handleMenuClose() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <div className={`side-buttons ${isMenuOpen ? 'hidden' : ''}`}>
        <button
          className={`side-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={handleMenuToggle}
          title="Menu"
          aria-label="Toggle menu"
        >
          <MenuIcon open={isMenuOpen} />
        </button>

        <button
          className={`side-btn ${isFullscreen ? 'active' : ''}`}
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
        </button>
      </div>

      <Menu
        layout={layout}
        onLayoutChange={onLayoutChange}
        streams={streams}
        onStreamsChange={onStreamsChange}
        onAddStream={onAddStream}
        onRemoveStream={onRemoveStream}
        onResetStreams={onResetStreams}
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
      />
    </>
  );
}
