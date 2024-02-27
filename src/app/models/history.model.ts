export interface Change<T> {
  email: string;
  name: string;
  date: Date;
  details: string;
  value?: T;
}
