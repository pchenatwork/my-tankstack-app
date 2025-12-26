/*
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Comment {
    id: number;
    name: string;
    email: string;
    body: string;
}
    */

export type PagedResponse<T> = {
  items: T[],
  filteredNumber: number
  totalNumber: number,
}

export type PagedRequestBase<T> = {
  filter: string,
  pageNumber: number,
  pageSize:number,
  sortColumn: keyof T,
  isDescending: boolean 
}

export type SortDirection = 'asc' | 'desc';