export interface TagModel extends TagBase {
  exists: boolean;
}

export interface TagModelDatabase extends TagBase {

}

interface TagBase {
  key: string;
  description: string;
}
