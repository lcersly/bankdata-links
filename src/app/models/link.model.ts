export interface Link  extends LinkBase{

}

export interface LinkDatabase extends LinkBase{

}

interface LinkBase{
  url: string;
  name: string;
  description?: string;
  path: string;
  section: string;
  tags?: string[];
  environment: undefined | 'S' | 'P' | 'ALL';
  icon?: string;
}
