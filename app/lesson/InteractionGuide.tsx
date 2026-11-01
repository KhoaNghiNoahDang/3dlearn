import { useEffect, useId, useState } from 'react';
import type { InteractionGuideProps } from './lesson.types';
import './lesson.css';

const GUIDE_ITEMS = [
  ['↻', 'Xoay mô hình', 'Kéo bằng chuột hoặc một ngón tay trên màn hình cảm ứng.'],
  ['✥', 'Di chuyển khung nhìn', 'Giữ chuột phải hoặc dùng hai ngón tay để kéo mô hình.'],
  ['＋', 'Phóng to / thu nhỏ', 'Cuộn con lăn chuột hoặc chụm hai ngón tay.'],
  ['◎', 'Chạm để khám phá', 'Chạm vào vật thể để xem nhãn, thông số hoặc điểm tương tác.'],
] as const;

export function InteractionGuide({
  defaultOpen = true,
  storageKey = 'lesson-3d-guide-open',
  onOpenChange,
  className = '',
}: InteractionGuideProps) {
  const titleId = useId();
  const [open, setOpen] = useState(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved === null ? defaultOpen : saved === 'true';
    } catch {
      return defaultOpen;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, String(open));
    } catch {
      // Private browsing or storage restrictions should not break the guide.
    }
    onOpenChange?.(open);
  }, [onOpenChange, open, storageKey]);

  return (
    <div className={`lesson-tool lesson-guide ${className}`.trim()}>
      <button
        className="lesson-guide__toggle"
        type="button"
        aria-expanded={open}
        aria-controls={titleId}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">?</span>
        <span>Hướng dẫn thao tác</span>
      </button>

      {open && (
        <section className="lesson-guide__panel" id={titleId} aria-label="Hướng dẫn thao tác mô hình 3D">
          <h2 className="lesson-guide__heading">Khám phá mô hình 3D</h2>
          <ul className="lesson-guide__list">
            {GUIDE_ITEMS.map(([badge, title, description]) => (
              <li className="lesson-guide__item" key={title}>
                <span className="lesson-guide__badge" aria-hidden="true">{badge}</span>
                <span><strong>{title}</strong><span>{description}</span></span>
              </li>
            ))}
          </ul>
          <div className="lesson-keyboard-help" aria-label="Phím tắt">
            <div className="lesson-keyboard-help__row"><span>Đặt lại góc nhìn</span><kbd>R</kbd></div>
            <div className="lesson-keyboard-help__row"><span>Toàn màn hình</span><kbd>F</kbd></div>
            <div className="lesson-keyboard-help__row"><span>Mở trợ giúp</span><kbd>?</kbd></div>
            <div className="lesson-keyboard-help__row"><span>Giảm chuyển động</span><span>Tự động theo hệ thống</span></div>
          </div>
        </section>
      )}
    </div>
  );
}

