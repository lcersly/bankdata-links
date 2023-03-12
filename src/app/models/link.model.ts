import {Tag} from './tag.model';

export interface LinkBase{
  url: string;
  name: string;
  description?: string;
  tags: Tag[] | string[];
}

export interface Link extends LinkBase{
  tags: Tag[];
  uuid: string;
}
