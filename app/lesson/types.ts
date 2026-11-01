import type { SubjectKey } from '../content/manifest';

export type LessonSubject = Exclude<SubjectKey, 'all'>;

export type CatalogLesson = {
  slug: string;
  subject: LessonSubject;
  title: string;
  type: string;
  question: string;
  textbook: string[];
  steps: string[];
  file: string;
  cover: string;
  online?: string;
};

export type CourseMapping = {
  courseSlug: string;
  legacyFile: string;
  legacyCover: string;
  legacySubject: LessonSubject;
  title: string;
  topic: string;
  candidateBookIds: string[];
  matchType: 'strong-topic' | 'candidate' | 'cross-grade' | string;
  mappingStatus: 'verified' | 'needs-verification' | 'needs-book-page-mapping' | string;
  textbookPageRefs: Array<number | string>;
  chapterRefs: Array<string | {
    bookId?: string;
    curriculum?: string;
    grade?: number;
    chapter?: string;
    lesson?: string;
  }>;
  confidence: 'high' | 'medium' | 'provisional' | string;
  evidence?: {
    catalogTextbookRefs?: string[];
    derivedFrom?: string[];
    pdfEvidence?: string;
  };
  notes?: string;
};

export type LessonBook = {
  id: string;
  subject: LessonSubject;
  grade: number;
  title: string;
  file: string;
  status: string;
};

export type LessonMetadata = {
  slug: string;
  title: string;
  subject: LessonSubject;
  subjectLabel: string;
  grade: number | null;
  grades: number[];
  type: string;
  question: string;
  steps: string[];
  cover: string;
  legacyFile: string;
  online?: string;
  topic: string;
  candidateBooks: LessonBook[];
  textbookRefs: string[];
  textbookPageRefs: Array<number | string>;
  chapterRefs: string[];
  mappingStatus: CourseMapping['mappingStatus'];
  matchType: CourseMapping['matchType'];
  confidence: CourseMapping['confidence'];
  isMappingVerified: boolean;
  source: {
    catalog: 'catalog.json';
    mapping: 'content/course-mapping.json' | null;
  };
};

export class LessonNotFoundError extends Error {
  readonly slug: string;

  constructor(slug: string) {
    super(`Không tìm thấy bài học với slug: ${slug}`);
    this.name = 'LessonNotFoundError';
    this.slug = slug;
  }
}
