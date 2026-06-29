import { useCallback, useState } from 'react';

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
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  assignTarget,
  onAssignStream,
  onCancelAssign,
  isMenuOpen: controlledIsMenuOpen,
  onMenuToggle,
  onMenuClose,
}) {
  const [internalIsMenuOpen, setInternalIsMenuOpen] = useState(false);
  const isMenuOpen = controlledIsMenuOpen !== undefined ? controlledIsMenuOpen : internalIsMenuOpen;
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleMenuToggle = useCallback(() => {
    if (onMenuToggle) {
      onMenuToggle();
    } else {
      setInternalIsMenuOpen((open) => !open);
    }
  }, [onMenuToggle]);

  const handleMenuClose = useCallback(() => {
    if (onMenuClose) {
      onMenuClose();
    } else {
      setInternalIsMenuOpen(false);
    }
  }, [onMenuClose]);

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
        presets={presets}
        onSavePreset={onSavePreset}
        onLoadPreset={onLoadPreset}
        onDeletePreset={onDeletePreset}
        assignTarget={assignTarget}
        onAssignStream={onAssignStream}
        onCancelAssign={onCancelAssign}
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
      />
    </>
  );
}
