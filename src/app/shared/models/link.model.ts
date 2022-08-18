import {Icon} from './icon.model';

export interface Link<T = any> {
  url: string;
  name: string;
  description?: string;
  path: string;
  section: string;
  tags: T[];
  icons: Icon[];
  id?: string;
}
