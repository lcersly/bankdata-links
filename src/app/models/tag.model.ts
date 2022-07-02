export type TagBasic = {
  key: string;
  description: string;
}

export type TagWithID = {
  id: string;
}

export type TagExists = {
  exists: boolean;
}

export type TagDatabase = TagBasic;
export type TagDatabaseAfter = TagBasic & TagExists & TagWithID;
export type TagSelection = TagBasic & TagExists;
