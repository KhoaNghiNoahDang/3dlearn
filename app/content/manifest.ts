export type SubjectKey = 'all' | 'phys' | 'chem' | 'bio' | 'geo';

export type Book = {
  id: string;
  subject: Exclude<SubjectKey, 'all'>;
  grade: number;
  title: string;
  file: string;
  status: 'Đang xây dựng' | 'Có mô phỏng';
};

export const subjectMeta = {
  phys: { label: 'Vật lí', short: 'Vật lí', color: '#5d8dff', soft: '#eaf0ff', icon: '✦' },
  chem: { label: 'Hoá học', short: 'Hoá học', color: '#ff8757', soft: '#fff0e9', icon: '⚗' },
  bio: { label: 'Sinh học', short: 'Sinh học', color: '#41c98a', soft: '#e8f8ef', icon: '⌁' },
  geo: { label: 'Địa lí', short: 'Địa lí', color: '#38c5d4', soft: '#e5f8fa', icon: '◉' },
} as const;

// Manifest mapping theo các PDF SGK Việt Nam hiện có trong thư mục SGK.
// Catalog mô phỏng là nguồn bài học; mapping này là lớp metadata để mở rộng dần theo chương/trang.
export const books: Book[] = [
  { id: 'vat-li-10', subject: 'phys', grade: 10, title: 'Vật lí 10', file: 'SGK/SGK Vật lí 10-mau.pdf', status: 'Có mô phỏng' },
  { id: 'vat-li-11', subject: 'phys', grade: 11, title: 'Vật lí 11', file: 'SGK/SGK Vật Lí 11-mau.pdf', status: 'Có mô phỏng' },
  { id: 'vat-li-12', subject: 'phys', grade: 12, title: 'Vật lí 12', file: 'SGK/SGK Vật lí 12-mau.pdf', status: 'Có mô phỏng' },
  { id: 'hoa-hoc-11', subject: 'chem', grade: 11, title: 'Hoá học 11', file: 'SGK/SGK Hóa học 11-mau.pdf', status: 'Có mô phỏng' },
  { id: 'hoa-hoc-12', subject: 'chem', grade: 12, title: 'Hoá học 12', file: 'SGK/SGK Hóa học 12-mau.pdf', status: 'Có mô phỏng' },
  { id: 'sinh-hoc-10', subject: 'bio', grade: 10, title: 'Sinh học 10', file: 'SGK/SGK Sinh học 10-mau.pdf', status: 'Có mô phỏng' },
  { id: 'sinh-hoc-11', subject: 'bio', grade: 11, title: 'Sinh học 11', file: 'SGK/SGK Sinh học 11-mau.pdf', status: 'Có mô phỏng' },
  { id: 'sinh-hoc-12', subject: 'bio', grade: 12, title: 'Sinh học 12', file: 'SGK/SGK Sinh học 12-mau.pdf', status: 'Có mô phỏng' },
  { id: 'dia-li-10', subject: 'geo', grade: 10, title: 'Địa lí 10', file: 'SGK/SGK Địa lí 10-mau.pdf', status: 'Có mô phỏng' },
];
