import type { Media } from "./common.types";
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

export interface LoginResponse {
  name: string;
  email: string;
  bio?: string;
  venueManager?: boolean;
  avatar?: Media;
  banner?: Media;
  accessToken: string;
}

export interface RegisterResponse {
  name: string;
  email: string;
  bio?: string;
  venueManager?: boolean;
  avatar?: Media;
  banner?: Media;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  venueManager?: boolean;
  avatar?: Media;
  banner?: Media;
}
