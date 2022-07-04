export interface Link<T = any> {
  url: string;
  name: string;
  description?: string;
  path: string;
  section: string;
  tags: T[];
  environment: undefined | 'S' | 'P' | 'ALL';
  icon?: string;
}
