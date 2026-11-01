import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import './LessonShell.css';
import legacyManifest from '../legacy/manifest.json';
// @ts-ignore The legacy adapter remains browser-compatible JavaScript.
import { getLegacyUrl } from '../legacy/adapter.js';
export type LessonSubject = 'phys' | 'chem' | 'bio' | 'geo' | string;

export type LessonStep = {
  id?: string;
  title: string;
  instruction?: string;
  completed?: boolean;
};

export type LessonShellData = {
  title: string;
  subject: LessonSubject;
  subjectLabel?: string;
  type?: string;
  question?: string;
  steps?: Array<string | LessonStep>;
  cover?: string;
  textbook?: string[];
};

export type LessonShellProps = {
  /** The allowlisted lesson slug used to identify the legacy simulation. */
  slug: string;
  /** Lesson metadata. Pass null/undefined to render the not-found state. */
  lesson?: LessonShellData | null;
  onBack?: () => void;
  onStepChange?: (stepIndex: number) => void;
  className?: string;
};

const SUBJECT_LABELS: Record<string, string> = {
  phys: 'Vật lí',
  chem: 'Hoá học',
  bio: 'Sinh học',
  geo: 'Địa lí',
};

const SUBJECT_COLORS: Record<string, string> = {
  phys: '#5d8dff',
  chem: '#ff8757',
  bio: '#41c98a',
  geo: '#38c5d4',
};

const SUBJECT_ICONS: Record<string, string> = {
  phys: '✦',
  chem: '⚗',
  bio: '⌁',
  geo: '◉',
};

const LEGACY_BRIDGE_MESSAGE = '3dlearn:legacy-bridge';
const LEGACY_BRIDGE_VERSION = 1;
const LEGACY_BRIDGE_TYPES = new Set(['ready', 'stepChanged', 'modeChanged', 'state', 'ack']);

function getBridgeTargetOrigin(src: string) {
  if (!src) return '*';
  return '*';
}

function Icon({ name }: { name: 'back' | 'expand' | 'reload' | 'compress' | 'spark' | 'book' | 'close' | 'target' | 'microscope' | 'list' | 'bookmark' | 'phys' | 'chem' | 'bio' | 'geo' }) {
  const paths = {
    back: <><path d="m15 18-6-6 6-6" /><path d="M9 12h10" /></>,
    expand: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" /><path d="m3 8 5-5m8 0 5 5M3 16l5 5m8 0 5-5" /></>,
    reload: <><path d="M20 11a8 8 0 1 0 1 4" /><path d="M20 4v7h-7" /></>,
    compress: <path d="M9 15H5v4M15 9h4V5M15 15l4 4M9 9 5 5" />,
    spark: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    book: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
    close: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    microscope: <><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></>,
    bookmark: <><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></>,
    phys: <><circle cx="12" cy="12" r="2" /><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(30 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-30 12 12)" /></>,
    chem: <><path d="M10 2v5.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 7.5V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></>,
    bio: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>,
    geo: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>,
  };
  return <svg className="ls-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function LessonShell({ slug, lesson, onBack, onStepChange, className = '' }: LessonShellProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const frameTimeoutRef = useRef<number | null>(null);
  const [frameKey, setFrameKey] = useState(0);
  const [frameStatus, setFrameStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [bridgeReady, setBridgeReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showGuide, setShowGuide] = useState(true);

  const safeSlug = slug.trim().toLowerCase();
  const src = useMemo(() => {
    try {
      return getLegacyUrl(safeSlug, { manifest: legacyManifest });
    } catch {
      return '';
    }
  }, [safeSlug]);
  const subjectLabel = lesson ? (lesson.subjectLabel ?? SUBJECT_LABELS[lesson.subject] ?? lesson.subject) : '';
  const accent = lesson ? SUBJECT_COLORS[lesson.subject] ?? '#6d7cff' : '#6d7cff';
  const subjectIcon = lesson ? SUBJECT_ICONS[lesson.subject] ?? '✦' : '✦';
  const steps = lesson?.steps ?? [];
  const progress = steps.length ? ((activeStep + 1) / steps.length) * 100 : 0;

  useEffect(() => {
    setFrameStatus(src ? 'loading' : 'error');
    setWebglSupported(null);
    setBridgeReady(false);
    if (!src) return;
    const canvas = document.createElement('canvas');
    setWebglSupported(Boolean(
      canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'),
    ));
    frameTimeoutRef.current = window.setTimeout(() => setFrameStatus('error'), 15000);
    return () => {
      if (frameTimeoutRef.current !== null) window.clearTimeout(frameTimeoutRef.current);
    };
  }, [frameKey, src]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const expectedOrigin = src ? new URL(src, window.location.href).origin : window.location.origin;
      if (event.origin !== 'null' && event.origin !== expectedOrigin) return;
      const message = event.data;
      if (!message || message.protocol !== LEGACY_BRIDGE_MESSAGE || message.version !== LEGACY_BRIDGE_VERSION) return;
      if (!LEGACY_BRIDGE_TYPES.has(message.type)) return;
      if (message.type === 'ready') {
        setBridgeReady(true);
      }
      if (message.type === 'stepChanged' && Number.isInteger(message.payload?.index)) {
        setActiveStep(message.payload.index);
        onStepChange?.(message.payload.index);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onStepChange, src]);

  const sendBridgeCommand = useCallback((command: string, payload: Record<string, unknown> = {}) => {
    const target = frameRef.current?.contentWindow;
    if (!target) return false;
    target.postMessage({
      protocol: LEGACY_BRIDGE_MESSAGE,
      version: LEGACY_BRIDGE_VERSION,
      type: command,
      payload,
      requestId: `${command}-${Date.now()}`,
    }, getBridgeTargetOrigin(src));
    return true;
  }, [src]);

  const resetSimulation = useCallback(() => {
    if (!bridgeReady || !sendBridgeCommand('reset')) setFrameKey((key) => key + 1);
  }, [bridgeReady, sendBridgeCommand]);

  const selectStep = useCallback((index: number) => {
    if (index < 0 || index >= steps.length) return;
    setActiveStep(index);
    onStepChange?.(index);
    sendBridgeCommand('setStep', { index });
  }, [onStepChange, sendBridgeCommand, steps.length]);

  const toggleFullscreen = useCallback(async () => {
    const wrap = frameRef.current?.parentElement;
    if (!wrap) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.fullscreenEnabled && wrap.requestFullscreen) {
        await wrap.requestFullscreen();
      }
    } catch {
      // Browsers may reject fullscreen in embedded or restricted contexts.
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        void toggleFullscreen();
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        resetSimulation();
      } else if (event.key === 'g' || event.key === 'G') {
        event.preventDefault();
        setShowGuide((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, resetSimulation]);

  if (!lesson || !src) {
    return <section className={`ls-shell ls-shell-error ${className}`} aria-live="polite">
      <div className="ls-error-card">
        <span className="ls-error-mark">!</span>
        <p className="ls-kicker">KHÔNG TÌM THẤY BÀI HỌC</p>
        <h1>Bài mô phỏng không tồn tại</h1>
        <p>Slug <code>{slug || '(trống)'}</code> chưa có trong manifest bài học hoặc đường dẫn không hợp lệ.</p>
        {onBack && <button className="ls-btn ls-btn-primary" onClick={onBack}><Icon name="back" /> Quay lại thư viện</button>}
      </div>
    </section>;
  }

  const shellStyle = { '--ls-accent': accent } as CSSProperties;

  return <main className={`ls-shell ${isFullscreen ? 'is-fullscreen' : ''} ${showGuide ? 'has-guide' : ''} ${className}`} style={shellStyle}>
    {/* ── Compact header bar ── */}
    <header className="ls-topbar">
      <button className="ls-back" onClick={onBack} disabled={!onBack} aria-label="Quay lại thư viện">
        <Icon name="back" />
      </button>
      <span className="ls-divider" />
      <span className="ls-subject-badge">
        {['phys', 'chem', 'bio', 'geo'].includes(lesson.subject) ? <Icon name={lesson.subject as any} /> : <span>✦</span>}
        <span>{subjectLabel}</span>
      </span>
      <div className="ls-title-area">
        <h1>{lesson.title}</h1>
        {lesson.type && <span className="ls-type">{lesson.type}</span>}
      </div>
      {steps.length > 0 && (
        <div className="ls-progress" title={`Bước ${activeStep + 1} / ${steps.length}`}>
          <div className="ls-progress-bar"><i style={{ transform: `scaleX(${progress / 100})` }} /></div>
          <span>{activeStep + 1}/{steps.length}</span>
        </div>
      )}
      <div className="ls-topbar-actions">
        <button onClick={() => setShowGuide(!showGuide)} title="Hướng dẫn bài học (G)" className={`ls-action-btn ls-guide-toggle ${showGuide ? 'is-active' : ''}`}>
          <Icon name="book" /><span>Hướng dẫn</span>
        </button>
        <button onClick={resetSimulation} title="Đặt lại mô phỏng (R)" className="ls-action-btn">
          <Icon name="reload" /><span>Đặt lại</span>
        </button>
        <button onClick={() => void toggleFullscreen()} title={isFullscreen ? 'Thoát toàn màn hình (Esc)' : 'Toàn màn hình (F)'} className="ls-action-btn ls-fullscreen-btn" disabled={!document.fullscreenEnabled}>
          <Icon name={isFullscreen ? 'compress' : 'expand'} /><span>{isFullscreen ? 'Thoát' : 'Toàn màn hình'}</span>
        </button>
      </div>
    </header>

    {/* ── Immersive 3D viewport ── */}
    <div className="ls-viewport">
      {frameStatus === 'loading' && <div className="ls-status" role="status"><span className="ls-spinner" /><strong>Đang khởi tạo phòng thí nghiệm…</strong><small>Mô hình 3D đang được tải</small></div>}
      {frameStatus === 'error' && <div className="ls-status ls-status-error" role="alert"><span className="ls-error-mark">!</span><strong>Không thể tải mô phỏng</strong><small>Kiểm tra đường dẫn bài học hoặc kết nối máy chủ.</small><button className="ls-btn ls-btn-primary" onClick={() => { setFrameStatus('loading'); setFrameKey((key) => key + 1); }}>Thử lại</button></div>}
      {webglSupported === false && <div className="ls-webgl-notice" role="status"><strong>⚠ WebGL</strong><span>Thiết bị chưa hỗ trợ. Hãy thử trình duyệt khác hoặc bật tăng tốc phần cứng.</span></div>}
      <iframe
        key={frameKey}
        ref={frameRef}
        className="ls-frame"
        src={src}
        title={`Mô phỏng 3D - ${lesson.title}`}
        loading="eager"
        allow="fullscreen; autoplay; pointer-lock"
        allowFullScreen
        // These are first-party, same-origin lesson documents. allow-same-origin
        // is required in Vite dev because inline module scripts are rewritten to
        // a separate /courses/*.html?html-proxy module URL inside the iframe.
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-pointer-lock allow-presentation"
        onLoad={() => {
          if (frameTimeoutRef.current !== null) window.clearTimeout(frameTimeoutRef.current);
          setFrameStatus('ready');
          const target = frameRef.current?.contentWindow;
          target?.postMessage({ protocol: LEGACY_BRIDGE_MESSAGE, version: LEGACY_BRIDGE_VERSION, type: 'requestState' }, getBridgeTargetOrigin(src));
        }}
        onError={() => {
          if (frameTimeoutRef.current !== null) window.clearTimeout(frameTimeoutRef.current);
          setFrameStatus('error');
        }}
      />
      {/* ── Floating guide panel ── */}
      {showGuide && (lesson.question || steps.length > 0 || (lesson.textbook && lesson.textbook.length > 0)) && (
        <aside className="ls-guide" role="complementary" aria-label="Hướng dẫn bài học">
          <header className="ls-guide-header">
            <h2>Hướng dẫn bài học</h2>
            <button className="ls-guide-close" onClick={() => setShowGuide(false)} aria-label="Đóng hướng dẫn">
              <Icon name="close" />
            </button>
          </header>

          {lesson.question && (
            <section className="ls-guide-section">
              <h3><Icon name="target" /> Câu hỏi chính</h3>
              <p>{lesson.question}</p>
            </section>
          )}

          {lesson.type && (
            <section className="ls-guide-section">
              <h3><Icon name="microscope" /> Loại bài</h3>
              <p className="ls-guide-tag">{lesson.type}</p>
            </section>
          )}

          {steps.length > 0 && (
            <section className="ls-guide-section">
              <h3><Icon name="list" /> Các bước ({activeStep + 1}/{steps.length})</h3>
              <ol className="ls-guide-steps">
                {steps.map((step, i) => {
                  const label = typeof step === 'string' ? step : step.title;
                  const instruction = typeof step !== 'string' ? step.instruction : undefined;
                  const done = (typeof step !== 'string' && step.completed) || i < activeStep;
                  return (
                    <li key={i} className={`${i === activeStep ? 'is-active' : ''} ${done ? 'is-done' : ''}`}>
                      <button
                        type="button"
                        className="ls-step-button"
                        onClick={() => selectStep(i)}
                        aria-current={i === activeStep ? 'step' : undefined}
                        aria-label={`Chuyển đến bước ${i + 1}: ${label}`}
                      >
                        <span className="ls-step-num">{done ? '✓' : i + 1}</span>
                        <span className="ls-step-text">
                          <strong>{label}</strong>
                          {instruction && <small>{instruction}</small>}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {lesson.textbook && lesson.textbook.length > 0 && (
            <section className="ls-guide-section">
              <h3><Icon name="bookmark" /> Tham khảo SGK</h3>
              {lesson.textbook.map((ref, i) => <p key={i} className="ls-guide-ref">{ref}</p>)}
            </section>
          )}

          <footer className="ls-guide-footer">
            <small>Nhấn <kbd>G</kbd> để bật/tắt panel này</small>
          </footer>
        </aside>
      )}
      {/* Connection indicator */}
      <span className={`ls-connection ${bridgeReady ? 'is-connected' : ''}`}>
        <i />{bridgeReady ? 'Sẵn sàng' : 'Đang kết nối…'}
      </span>
    </div>
  </main>;
}

export const LessonPage = LessonShell;

export default LessonShell;
