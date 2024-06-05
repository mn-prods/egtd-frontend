import { Component, OnInit } from '@angular/core';
import { filter, first, firstValueFrom, Observable, Subject } from 'rxjs';
import { CrudService, SortOrder } from '../crud.service';
import { BaseGtdDocument } from '../interfaces/base.interface';
import { AsyncComponent } from './async.abstract.component';
import { PaginatedResult } from '../interfaces/paginates-result.interface';

export class PaginationConfig<E> {
  skip!: number;
  pageSize!: number;
  sortOrder: SortOrder | undefined;
  sortField: keyof E | undefined;
}

@Component({
  selector: '',
  template: '',
})
export abstract class ListComponent<
  E extends BaseGtdDocument,
  F = Partial<E>
> extends AsyncComponent implements OnInit {
  selectedEntities: E[] | undefined;
  entities: E[] | undefined;
  filter: F | undefined;

  // flags
  loading = false;

  // pagination and filtering
  pageSize = 10;
  page = 0;
  totalRecords = 0;
  sortOrder: SortOrder | undefined;
  sortField: keyof E | undefined;

  constructor(
    protected entityService: CrudService<E, F>,
    
  ) {
    super();
  }


  get paginationConfig(): PaginationConfig<E> {
    return {
      skip: this.page * this.pageSize,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    };
  }


  override ngOnInit(): void {
    this.unsubscribe$ = new Subject();
    this.lazyLoad();
  }

  private getDefaultPage(): PaginationConfig<E> {
    return <PaginationConfig<E>>{
      skip: 0,
      pageSize: this.pageSize,
      sortOrder: 'ASC',
      sortField: 'id',
    };
  }

  lazyLoad(
    filters?: F,
    config: PaginationConfig<E> = this.getDefaultPage()
  ): Observable<PaginatedResult<E>> {
    this.loading = true;

    const { pageSize, skip, sortField, sortOrder } = config;

    this.pageSize = pageSize;
    this.page = skip / pageSize;

    this.sortField = sortField;
    this.sortOrder = sortOrder;

    this.filter = filters;

    return this.entityService
      .find(
        this.filter,
        this.page,
        this.pageSize,
        this.sortField,
        this.sortOrder
      )
      .pipe(first(), filter(Boolean));
  }

  lazyLoadSubscriber({ content, totalElements }: PaginatedResult<E>) {
    this.entities = content;
    this.totalRecords = totalElements;
    this.loading = false;
  }

  async delete(entity: E, message: string) {
    if (!entity.id) {
      return;
    }

    await firstValueFrom(this.entityService.delete(entity.id));

    const { totalElements, content } = await firstValueFrom(
      this.entityService.find(
        this.filter,
        this.page,
        this.pageSize,
        this.sortField,
        this.sortOrder
      )
    );

    this.totalRecords = totalElements;
    this.entities = content;
  }
}
