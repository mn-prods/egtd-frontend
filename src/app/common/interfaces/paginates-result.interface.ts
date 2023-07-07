export interface PaginatedResult<T> {
    content: T[]
    totalElements: number;
    totalPages: number;
  }