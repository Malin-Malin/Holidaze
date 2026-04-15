export interface ApiResponse<T> {
  data: T;
  meta: Partial<PaginationMeta>;
}

export interface PagedApiResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

interface PaginationMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}
