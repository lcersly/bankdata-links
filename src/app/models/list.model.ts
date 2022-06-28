import {Link} from './link.model';

export interface ListModel extends ListBase {

}

export interface ListModelDatabase extends ListBase {

}

interface ListBase {
  editorUIDs: string[];
  links: Link[];
  public: boolean;
  viewMode: 'default';
}
