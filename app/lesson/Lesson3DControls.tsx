import { useCallback, useEffect, useState } from 'react';
import type { Lesson3DAction, Lesson3DControlsProps } from './lesson.types';
import './lesson.css';

type ControlButtonProps = {
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
};

function ControlButton({ label, shortcut, onClick, disabled, active = false, children }: ControlButtonProps) {
  return (
    <span className="lesson-control">
      <button
        className={`lesson-control__button${active ? ' is-active' : ''}`}
        type="button"
        aria-label={shortcut ? `${label}. Phím tắt ${shortcut}` : label}
        title={shortcut ? `${label} (${shortcut})` : label}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
      <span className="lesson-control__tooltip" role="tooltip">
        {label}{shortcut ? ` · ${shortcut}` : ''}
      </span>
    </span>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg className="lesson-control__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {children}
    </svg>
  );
}

export function Lesson3DControls({
  viewportRef,
  onAction,
  activeAction,
  onReset,
  onFullscreenChange,
  className = '',
  disabled = false,
}: Lesson3DControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const emit = useCallback((action: Lesson3DAction) => onAction?.(action), [onAction]);

  const reset = useCallback(() => {
    onReset?.();
    emit('reset');
  }, [emit, onReset]);

  const toggleFullscreen = useCallback(async () => {
    const element = viewportRef?.current;
    if (!element || !document.fullscreenEnabled) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    } catch {
      // Fullscreen can be rejected by browser policy; the rest of the lesson remains usable.
    }
  }, [viewportRef]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const next = Boolean(document.fullscreenElement);
      setIsFullscreen(next);
      onFullscreenChange?.(next);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onFullscreenChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled || event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;

      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        reset();
      } else if (event.key === 'f') {
        event.preventDefault();
        void toggleFullscreen();
      } else if (event.key === '?') {
        event.preventDefault();
        emit('keyboard-help');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, emit, reset, toggleFullscreen]);

  return (
    <div className={`lesson-tool lesson-controls ${className}`.trim()} aria-label="Điều khiển mô hình 3D">
      <ControlButton label="Xoay mô hình bằng chuột hoặc một ngón tay" shortcut="Kéo" active={activeAction === 'rotate'} disabled={disabled} onClick={() => emit('rotate')}>
        <Icon><path d="M20 11a8 8 0 0 0-14.8-4M4 5v4h4M4 13a8 8 0 0 0 14.8 4M20 19v-4h-4" /></Icon>
      </ControlButton>
      <ControlButton label="Di chuyển khung nhìn bằng chuột phải hoặc hai ngón tay" shortcut="Chuột phải" active={activeAction === 'pan'} disabled={disabled} onClick={() => emit('pan')}>
        <Icon><path d="M7 11V6a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v6c0 4-2.5 6-6.5 6H11c-2.3 0-3.5-1.2-4.6-3L4 13a1.5 1.5 0 0 1 3-1.5V11Z" /></Icon>
      </ControlButton>
      <ControlButton label="Phóng to hoặc thu nhỏ mô hình" shortcut="Cuộn / chụm" active={activeAction === 'zoom'} disabled={disabled} onClick={() => emit('zoom')}>
        <Icon><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5M10.5 7.5v6M7.5 10.5h6" /></Icon>
      </ControlButton>
      <ControlButton label="Đưa mô hình về góc nhìn ban đầu" shortcut="R" disabled={disabled} onClick={reset}>
        <Icon><path d="M3 12a9 9 0 1 0 3-6.7M3 4v6h6" /></Icon>
      </ControlButton>
    </div>
  );
}

