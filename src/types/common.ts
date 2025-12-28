
export type Option = {
  label: string;
  value: string | number;
};
export type PagedResponse<T> = {
  items: T[],
  filteredNumber: number
  totalNumber: number,
};
export type PagedRequest<T> = {
  filter: string,
  pageNumber: number,
  pageSize:number,
  sortColumn: keyof T,
  isDescending: boolean 
};

export type SortDirection = 'asc' | 'desc';