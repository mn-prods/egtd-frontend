import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseGtdDocument } from './interfaces/base.interface';
import { PaginatedResult } from './interfaces/paginates-result.interface';

export type NullablePartial<T> = {
  [P in keyof T]?: T[P] | null;
};

export type SortOrder = 'ASC' | 'DESC';

export class SortObject {
  [field: string]: SortOrder;
}

export interface BasePaginatedFilterDto {
  page: number;

  size: number;

  sort?: SortObject;
}

export abstract class CrudService<E, F = NullablePartial<E>> {
  abstract get(id: string): Observable<E>;

  abstract find(
    filter: F | undefined,
    page: number,
    size: number,
    sortField: keyof E | undefined,
    sortOrder: SortOrder | undefined
  ): Observable<PaginatedResult<E>>;

  abstract save(
    id: string | null,
    dto: Exclude<NullablePartial<E>, BaseGtdDocument>
  ): Observable<E>;

  abstract delete(id: string): Observable<void>;

  getPageableParams({ page, size, sort }: BasePaginatedFilterDto): HttpParams {
    let params = new HttpParams({ fromObject: { page, size } });

    for (const field in sort) {
      params = params.append('sort', `${field},${sort[field]}`);
    }

    return params;
  }
}
