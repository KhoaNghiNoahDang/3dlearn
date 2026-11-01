import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import catalog from '../catalog.json';
import courseMapping from '../content/course-mapping.json';
import { books, subjectMeta, type SubjectKey } from './content/manifest';
import { findLessonMetadata, LessonShell } from './lesson';
import { assetUrl, textbookUrl } from './config/runtime';
import type { CatalogItem } from './types';
import './styles.css';

const lessons = catalog as CatalogItem[];
const mappingBySlug = new Map(courseMapping.courses.map((course) => [course.courseSlug, course]));
const subjects: SubjectKey[] = ['all', 'phys', 'chem', 'bio', 'geo'];
const subjectLabels: Record<SubjectKey, string> = { all: 'Tất cả', phys: 'Vật lí', chem: 'Hoá học', bio: 'Sinh học', geo: 'Địa lí' };
const gradeOptions = ['all', '10', '11', '12'] as const;
type GradeFilter = typeof gradeOptions[number];

function Icon({ name }: { name: 'search' | 'sun' | 'moon' | 'arrow' | 'play' | 'spark' | 'book' }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 5 5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    moon: <path d="M20.7 15.4A8.7 8.7 0 0 1 8.6 3.3 8.7 8.7 0 1 0 20.7 15.4Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    play: <path d="m9 6 10 6-10 6V6Z" fill="currentColor" stroke="none" />,
    spark: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 19h16" /></>,
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function subjectOf(item: CatalogItem) { return subjectMeta[item.subject]; }

function gradesForLesson(item: CatalogItem) {
  const mappedBooks = mappingBySlug.get(item.slug)?.candidateBookIds ?? [];
  return books.filter((book) => mappedBooks.includes(book.id)).map((book) => String(book.grade));
}

function lessonSlugFromPath(pathname = window.location.pathname) {
  // Primary route: /app/lesson/<slug>
  const appMatch = pathname.match(/^\/app\/lesson\/([^/]+)\/?$/);
  if (appMatch) return decodeURIComponent(appMatch[1]);

  // Fallback: handle legacy URL patterns like /courses/<slug>.html
  const courseMatch = pathname.match(/\/([a-z0-9]+(?:-[a-z0-9]+)*)\.html(?:\?.*)?$/i);
  if (courseMatch) {
    const slug = courseMatch[1];
    window.history.replaceState(null, '', `/app/lesson/${slug}`);
    return slug;
  }

  return null;
}

function LessonRoute({ slug, onBack }: { slug: string; onBack: () => void }) {
  const lesson = findLessonMetadata(slug);
  return <LessonShell
    slug={slug}
    lesson={lesson}
    onBack={onBack}
    onStepChange={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  />;
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (url: string) => {
    window.history.pushState(null, '', url);
    setCurrentPath(window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lessonSlug = lessonSlugFromPath(currentPath);
  if (lessonSlug) return <LessonRoute slug={lessonSlug} onBack={() => navigate('/app/')} />;

  return <LibraryPage navigate={navigate} />;
}

function LibraryPage({ navigate }: { navigate: (url: string) => void }) {
  const [subject, setSubject] = useState<SubjectKey>('all');
  const [grade, setGrade] = useState<GradeFilter>('all');
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(() => localStorage.getItem('3d-theme') === 'dark');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('3d-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const filtered = useMemo(() => lessons.filter((item) => {
    const haystack = [item.title, item.type, item.question, ...item.textbook].join(' ').toLocaleLowerCase('vi');
    const gradeMatches = grade === 'all' || gradesForLesson(item).includes(grade);
    return (subject === 'all' || item.subject === subject) && gradeMatches && (!query.trim() || haystack.includes(query.trim().toLocaleLowerCase('vi')));
  }), [subject, grade, query]);

  const visible = showAll ? filtered : filtered.slice(0, 12);
  const counts = Object.fromEntries(subjects.map((key) => [key, key === 'all' ? lessons.length : lessons.filter((lesson) => lesson.subject === key).length]));
  const gradeCounts = Object.fromEntries(gradeOptions.map((value) => [value, value === 'all'
    ? (subject === 'all' ? lessons.length : lessons.filter((lesson) => lesson.subject === subject).length)
    : lessons.filter((lesson) => (subject === 'all' || lesson.subject === subject) && gradesForLesson(lesson).includes(value)).length,
  ])) as Record<GradeFilter, number>;
  const featured = lessons.filter((item) => ['titration-step', 'capacitor-step', 'enzyme-step'].includes(item.slug));

  const selectSubject = (nextSubject: SubjectKey) => {
    setSubject(nextSubject);
    setShowAll(false);
    if (grade !== 'all' && nextSubject !== 'all') {
      const nextGradeCount = lessons.filter((lesson) => lesson.subject === nextSubject && gradesForLesson(lesson).includes(grade)).length;
      if (nextGradeCount === 0) setGrade('all');
    }
  };

  return <div className="app-shell">
    <header className="hero">
      <div className="topbar page-width">
        <a className="brand" href="/app/" onClick={(e) => { e.preventDefault(); navigate('/app/'); }} aria-label="Phòng thí nghiệm 3D"><span className="brand-mark"><Icon name="spark" /></span><span><strong>Lab 3D</strong><small>HỌC BẰNG KHÁM PHÁ</small></span></a>
        <div className="top-actions"><span className="status-pill"><i /> Đang mở rộng theo SGK Việt Nam</span><button className="theme-btn" onClick={() => setDark(!dark)} aria-label="Đổi giao diện sáng tối"><Icon name={dark ? 'sun' : 'moon'} /></button></div>
      </div>
      <div className="hero-content page-width">
        <div className="hero-copy"><span className="eyebrow"><Icon name="spark" /> Không gian học tập tương tác</span><h1>Biến kiến thức<br /><em>thành trải nghiệm 3D.</em></h1><p>Khám phá thí nghiệm, hình ảnh và bài tập trong SGK bằng cách quan sát, thao tác và tự tìm ra quy luật.</p><div className="hero-actions"><a className="primary-btn" href="#library">Khám phá thư viện <Icon name="arrow" /></a><a className="text-btn" href="#books"><Icon name="book" /> Xem sách theo lớp</a></div></div>
        <div className="hero-art" aria-hidden="true"><div className="orb orb-one" /><div className="orb orb-two" /><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="core"><span>3D</span><small>LAB</small></div><div className="floating-note note-a">F = ma</div><div className="floating-note note-b">pH 7.0</div><div className="floating-note note-c">H₂O</div></div>
      </div>
      <div className="hero-glow" />
    </header>

    <main id="library" className="page-width">
      <section className="stats-row" aria-label="Tổng quan thư viện"><div><strong>{lessons.length}</strong><span>mô phỏng 3D</span></div><div><strong>09</strong><span>đầu sách SGK</span></div><div><strong>04</strong><span>môn học</span></div><div><strong>∞</strong><span>cách khám phá</span></div></section>
      <section className="section-heading"><div><span className="kicker">THƯ VIỆN KHÁM PHÁ</span><h2>Chọn một chủ đề để bắt đầu</h2><p>Mỗi mô phỏng được thiết kế như một phòng thí nghiệm nhỏ — nơi em có thể thử, sai và hiểu sâu hơn.</p></div><div className="result-count"><b>{filtered.length}</b> bài phù hợp</div></section>
      <section className="controls" aria-label="Bộ lọc bài học"><div className="subject-tabs" role="tablist" aria-label="Chọn môn học">{subjects.map((key) => <button key={key} className={`subject-tab ${subject === key ? 'active' : ''}`} style={key !== 'all' ? { '--accent': subjectMeta[key].color } as React.CSSProperties : undefined} onClick={() => selectSubject(key)} role="tab" aria-selected={subject === key}>{key !== 'all' && <span className="subject-dot" />}{subjectLabels[key]}<b>{counts[key]}</b></button>)}</div><label className="search-box"><Icon name="search" /><input value={query} onChange={(e) => { setQuery(e.target.value); setShowAll(false); }} placeholder="Tìm bài học, khái niệm..." /><kbd>⌘ K</kbd></label></section>
      <section className="filter-row grade-filter-row" aria-label="Chọn lớp theo môn học">
        <div className="grade-filter-heading"><span className="filter-label">Lớp học</span><strong>{subject === 'all' ? 'Tất cả môn' : subjectLabels[subject]}</strong><small>{grade === 'all' ? 'Đang xem mọi lớp' : `Đang xem Lớp ${grade}`}</small></div>
        <div className="grade-tabs" role="tablist" aria-label={`Các lớp của ${subject === 'all' ? 'tất cả môn' : subjectLabels[subject]}`}>
          {gradeOptions.map((value) => { const unavailable = value !== 'all' && gradeCounts[value] === 0; return <button key={value} className={`grade-tab ${grade === value ? 'active' : ''}`} style={{ '--grade-accent': subject === 'all' ? '#142238' : subjectMeta[subject].color } as React.CSSProperties} onClick={() => { if (unavailable) return; setGrade(value); setShowAll(false); }} disabled={unavailable} aria-disabled={unavailable} role="tab" aria-selected={grade === value} title={unavailable ? `Chưa có bài ${subjectLabels[subject]} lớp ${value}` : `${value === 'all' ? 'Tất cả lớp' : `Lớp ${value}`} · ${gradeCounts[value]} bài`}>{value === 'all' ? 'Tất cả' : `Lớp ${value}`}<b>{gradeCounts[value]}</b></button>; })}
        </div>
        <span className="filter-separator" />
        <span className="filter-label">Gợi ý</span>
        <button className="filter-chip soft" onClick={() => setQuery('thí nghiệm')}>Có thí nghiệm</button>
        <button className="filter-chip soft" onClick={() => setQuery('quy trình')}>Quy trình thực tế</button>
      </section>

      <section className="featured" id="books"><div className="mini-heading"><div><span className="kicker">BẮT ĐẦU TỪ ĐÂY</span><h2>Trải nghiệm nổi bật</h2></div><button className="link-btn" onClick={() => { setSubject('all'); setGrade('all'); setQuery(''); setShowAll(true); }}>Xem toàn bộ <Icon name="arrow" /></button></div><div className="featured-grid">{featured.map((item) => <LessonCard key={item.slug} item={item} featured onOpen={(slug) => navigate(`/app/lesson/${slug}`)} />)}</div></section>

      <section className="lesson-library"><div className="mini-heading"><div><span className="kicker">MỞ RỘNG KIẾN THỨC</span><h2>Tất cả mô phỏng</h2></div></div>{visible.length ? <div className="lesson-grid">{visible.map((item) => <LessonCard key={item.slug} item={item} onOpen={(slug) => navigate(`/app/lesson/${slug}`)} />)}</div> : <div className="empty"><span>⌁</span><h3>Chưa tìm thấy bài phù hợp</h3><p>Thử đổi môn học, lớp hoặc từ khoá tìm kiếm.</p><button className="primary-btn small" onClick={() => { setSubject('all'); setGrade('all'); setQuery(''); }}>Xoá bộ lọc</button></div>}{filtered.length > 12 && <button className="load-more" onClick={() => setShowAll(!showAll)}>{showAll ? 'Thu gọn danh sách' : `Xem thêm ${filtered.length - 12} bài học`} <Icon name="arrow" /></button>}</section>

      <section className="books-section"><div className="mini-heading"><div><span className="kicker">SÁCH GIÁO KHOA VIỆT NAM</span><h2>Đi từ trang sách đến không gian 3D</h2></div><span className="book-note">9 đầu sách đã được lập manifest</span></div><div className="book-grid">{books.map((book) => <BookCard key={book.id} book={book} lessonCount={lessons.filter((lesson) => lesson.subject === book.subject).length} />)}</div></section>
    </main>
    <footer className="footer page-width"><span className="brand-mark small"><Icon name="spark" /></span><span>Phòng thí nghiệm 3D · MVP app shell</span><span className="footer-right">Nội dung mô phỏng đang được đối chiếu và mở rộng theo từng SGK.</span></footer>
  </div>;
}

function LessonCard({ item, featured = false, onOpen }: { item: CatalogItem; featured?: boolean; onOpen?: (slug: string) => void }) {
  const meta = subjectOf(item);
  const href = `/app/lesson/${item.slug}`;
  const handleClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (onOpen) onOpen(item.slug);
    else window.location.href = href;
  };
  return <article className={`lesson-card ${featured ? 'featured-card' : ''}`} style={{ '--accent': meta.color, '--soft': meta.soft } as React.CSSProperties}>
    <a className="cover" href={href} onClick={handleClick}>
      <img src={assetUrl(item.cover)} alt="" loading="lazy" />
      <span className="cover-overlay" />
      <span className="subject-label">{meta.icon} {meta.short}</span>
      <span className="play"><Icon name="play" /></span>
      <span className="steps">{item.steps.length} bước <Icon name="arrow" /></span>
    </a>
    <div className="card-content">
      <span className="lesson-type">{item.type}</span>
      <h3><a href={href} onClick={handleClick}>{item.title}</a></h3>
      <p>{item.question}</p>
      <div className="card-footer">
        <span><Icon name="book" /> {item.textbook[0]?.split(' · ')[0] ?? 'SGK'}</span>
        <a href={href} onClick={handleClick} aria-label={`Mở bài ${item.title}`}><Icon name="arrow" /></a>
      </div>
    </div>
  </article>;
}

function BookCard({ book, lessonCount }: { book: typeof books[number]; lessonCount: number }) {
  const meta = subjectMeta[book.subject];
  const textbookConfigured = import.meta.env.DEV || Boolean(import.meta.env.VITE_TEXTBOOK_BASE_URL);
  return <article className="book-card" style={{ '--accent': meta.color, '--soft': meta.soft } as React.CSSProperties}><div className="book-spine" /><div className="book-icon">{meta.icon}</div><div className="book-info"><span>{meta.label} · Lớp {book.grade}</span><h3>{book.title}</h3><p>{lessonCount} mô phỏng liên quan đang được mở rộng.</p>{textbookConfigured ? <a href={textbookUrl(book.file)} target="_blank" rel="noreferrer">Mở sách PDF <Icon name="arrow" /></a> : <span className="book-private-note">PDF đang được lưu riêng trên storage</span>}</div></article>;
}

createRoot(document.getElementById('root')!).render(<App />);
