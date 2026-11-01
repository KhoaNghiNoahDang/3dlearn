import catalog from '../../catalog.json';
import courseMapping from '../../content/course-mapping.json';
import { books } from '../content/manifest';
import type {
  CatalogLesson,
  CourseMapping,
  LessonBook,
  LessonMetadata,
  LessonSubject,
} from './types';
import { LessonNotFoundError } from './types';

const catalogLessons = catalog as CatalogLesson[];
const mappings = courseMapping.courses as CourseMapping[];

const catalogBySlug = new Map(catalogLessons.map((lesson) => [lesson.slug, lesson]));
const mappingBySlug = new Map(mappings.map((mapping) => [mapping.courseSlug, mapping]));
const booksById = new Map<string, LessonBook>(
  books.map((book) => [book.id, { ...book }]),
);

const subjectLabels: Record<LessonSubject, string> = {
  phys: 'Vật lí',
  chem: 'Hoá học',
  bio: 'Sinh học',
  geo: 'Địa lí',
};

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function formatChapterRef(
  ref: string | { bookId?: string; curriculum?: string; grade?: number; chapter?: string; lesson?: string }
): string {
  if (typeof ref === 'string') return ref;
  return [ref.curriculum, ref.chapter, ref.lesson].filter(Boolean).join(' · ');
}

function resolveCandidateBooks(mapping?: CourseMapping): LessonBook[] {
  if (!mapping) return [];

  return mapping.candidateBookIds
    .map((bookId) => booksById.get(bookId))
    .filter((book): book is LessonBook => Boolean(book));
}

function resolveSubject(lesson: CatalogLesson, mapping?: CourseMapping): LessonSubject {
  // Catalog is the primary source because it drives the existing lesson cards.
  // The mapping subject is used only as a defensive fallback for future imports.
  return lesson.subject ?? mapping?.legacySubject ?? 'phys';
}

function createMetadata(lesson: CatalogLesson, mapping?: CourseMapping): LessonMetadata {
  const subject = resolveSubject(lesson, mapping);
  const candidateBooks = resolveCandidateBooks(mapping);
  const grades = unique(candidateBooks.map((book) => book.grade)).sort((a, b) => a - b);

  return {
    slug: lesson.slug,
    title: lesson.title,
    subject,
    subjectLabel: subjectLabels[subject],
    grade: grades[0] ?? null,
    grades,
    type: lesson.type,
    question: lesson.question,
    steps: [...lesson.steps],
    cover: `/${lesson.cover}`,
    legacyFile: `/${lesson.file}`,
    online: lesson.online,
    topic: mapping?.topic ?? lesson.title,
    candidateBooks,
    textbookRefs: [...lesson.textbook],
    textbookPageRefs: mapping?.textbookPageRefs ? [...mapping.textbookPageRefs] : [],
    chapterRefs: mapping?.chapterRefs ? mapping.chapterRefs.map(formatChapterRef) : [],
    mappingStatus: mapping?.mappingStatus ?? 'needs-book-page-mapping',
    matchType: mapping?.matchType ?? 'candidate',
    confidence: mapping?.confidence ?? 'provisional',
    isMappingVerified: mapping?.mappingStatus === 'verified' || mapping?.mappingStatus === 'verified-curriculum',
    source: {
      catalog: 'catalog.json',
      mapping: mapping ? 'content/course-mapping.json' : null,
    },
  };
}

export function getLessonMetadata(slug: string): LessonMetadata {
  const normalizedSlug = slug.trim().replace(/^\/+|\/+$/g, '');
  const lesson = catalogBySlug.get(normalizedSlug);

  if (!lesson) throw new LessonNotFoundError(normalizedSlug);

  return createMetadata(lesson, mappingBySlug.get(normalizedSlug));
}

export function findLessonMetadata(slug: string): LessonMetadata | null {
  try {
    return getLessonMetadata(slug);
  } catch (error) {
    if (error instanceof LessonNotFoundError) return null;
    throw error;
  }
}

export function listLessonMetadata(): LessonMetadata[] {
  return catalogLessons.map((lesson) => createMetadata(lesson, mappingBySlug.get(lesson.slug)));
}

export function getCandidateBooks(slug: string): LessonBook[] {
  return getLessonMetadata(slug).candidateBooks;
}

export function getLessonDataSources() {
  return {
    catalogCount: catalogLessons.length,
    mappingCount: mappings.length,
    bookCount: booksById.size,
  } as const;
}
