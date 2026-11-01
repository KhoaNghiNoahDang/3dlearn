import fs from 'node:fs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const catalogFile = 'catalog.json';
const mappingFile = 'content/course-mapping.json';
const catalog = readJson(catalogFile);
const mapping = readJson(mappingFile);
const bySlug = new Map(catalog.map((item) => [item.slug, item]));
const mappingBySlug = new Map(mapping.courses.map((item) => [item.courseSlug, item]));
const applied = [];

function apply(slug, title, source) {
  const item = bySlug.get(slug);
  if (!item || !title) return;
  const oldTitle = item.title;
  item.title = title;
  item.curriculum = {
    ...(item.curriculum || {}),
    sourceBookId: source.sourceBookId || source.sourceBook || item.curriculum?.sourceBookId,
    chapter: source.chapter || item.curriculum?.chapter,
    lesson: source.lesson || item.curriculum?.lesson,
    printedPage: source.printedPage ?? source.page ?? item.curriculum?.printedPage,
    figureRef: source.figureRef ?? item.curriculum?.figureRef,
    confidence: source.confidence,
    previousTitle: oldTitle,
  };
  const mapped = mappingBySlug.get(slug);
  if (mapped) {
    mapped.title = title;
    mapped.mappingStatus = source.confidence === 'high' ? 'verified-curriculum' : mapped.mappingStatus;
    mapped.textbookPageRefs = [source.printedPage ?? source.page].filter(Boolean);
    mapped.chapterRefs = [{
      bookId: source.sourceBookId || source.sourceBook,
      chapter: source.chapter,
      lesson: source.lesson,
      printedPage: source.printedPage ?? source.page,
      confidence: source.confidence,
    }];
  }
  applied.push({ slug, oldTitle, newTitle: title, confidence: source.confidence });
}

const chemistry = readJson('content/phase2/overwrite-chemistry.json');
for (const record of chemistry.mappings) {
  if (record.confidence === 'high') apply(record.slug, record.newTitle, record);
}

const biology = readJson('content/phase2/overwrite-biology.json');
for (const record of biology.overwrites) {
  if (record.confidence !== 'high') continue;
  const source = {
    sourceBookId: record.grade ? `sinh-hoc-${record.grade}` : undefined,
    lesson: record.displayName,
    confidence: record.confidence,
    figureRef: null,
  };
  apply(record.id, record.displayName, source);
}

// These existing Geography lessons are direct, high-confidence matches to the
// OCR-confirmed SGK titles. Partial topic courses keep their descriptive title.
const geography = new Map([
  ['insolation-step', ['Hệ quả địa lí các chuyển động của Trái Đất', 5]],
  ['tectonic-step', ['Thạch quyển, thuyết kiến tạo mảng', 6]],
  ['heating-step', ['Khí quyển, các yếu tố khí hậu', 9]],
  ['wind-step', ['Khí quyển, các yếu tố khí hậu', 9]],
  ['circulation-step', ['Khí quyển, các yếu tố khí hậu', 9]],
  ['water-cycle-step', ['Thuỷ quyển, nước trên lục địa', 11]],
  ['soil-step', ['Đất trên Trái Đất', 14]],
]);
for (const [slug, [title, lesson]] of geography) {
  apply(slug, title, {
    sourceBookId: 'dia-li-10-ket-noi-tri-thuc',
    chapter: 'Địa lí 10 – Kết nối tri thức với cuộc sống',
    lesson: `Bài ${lesson}`,
    printedPage: null,
    confidence: 'high',
  });
}

writeJson(catalogFile, catalog);
writeJson(mappingFile, mapping);
console.log(JSON.stringify({ applied, count: applied.length }, null, 2));
