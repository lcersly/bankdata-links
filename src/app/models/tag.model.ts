export interface TagModel extends TagBase {

}

export interface TagModelDatabase extends TagBase {

}

interface TagBase {
  key: string;
  description: string;
}
