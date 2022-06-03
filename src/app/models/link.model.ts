export interface Link {
  url: string;
  name?: string;
  description?: string;
  section: string;
  tags?: string[];
  environment: undefined | 'S' | 'P';
  icon?: string;
}
