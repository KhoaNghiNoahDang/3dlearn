export type CatalogItem = {
  slug: string;
  subject: 'phys' | 'chem' | 'bio' | 'geo';
  title: string;
  type: string;
  question: string;
  textbook: string[];
  steps: string[];
  file: string;
  cover: string;
  online?: string;
};
