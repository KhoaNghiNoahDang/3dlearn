import type { RefObject } from 'react';

export type Lesson3DAction =
  | 'rotate'
  | 'pan'
  | 'zoom'
  | 'reset'
  | 'fullscreen'
  | 'keyboard-help';

export type Lesson3DControlsProps = {
  /** Element that owns the 3D viewport. Used as the fullscreen target. */
  viewportRef?: RefObject<HTMLElement | null>;
  onAction?: (action: Lesson3DAction) => void;
  activeAction?: Exclude<Lesson3DAction, 'reset' | 'fullscreen' | 'keyboard-help'>;
  onReset?: () => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  className?: string;
  disabled?: boolean;
};

export type InteractionGuideProps = {
  defaultOpen?: boolean;
  storageKey?: string;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};
