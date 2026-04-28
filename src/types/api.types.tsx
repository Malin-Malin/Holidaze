export interface ApiResponse<T> {
  data: T;
  meta: PaginationMeta;
  errors?: string[];
}
interface PaginationMeta {
  isFirstPage?: boolean;
  isLastPage?: boolean;
  currentPage?: number;
  previousPage?: number | null;
  nextPage?: number | null;
  pageCount?: number;
  totalCount?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}
