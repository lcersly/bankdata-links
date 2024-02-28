export type ChangeDetails = 'Updated' | 'Deleted' | 'Created';

export interface Change<T, D = Date> {
  email: string;
  name: string;
  date: D;
  details: ChangeDetails;
  changeDetails: Record<Partial<keyof T>, [string, string]>;
}
