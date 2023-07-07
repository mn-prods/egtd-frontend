import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { filter, first, firstValueFrom, Observable, Subject } from 'rxjs';
import { ChoiceModalComponent } from './choice-modal/choice-modal.component';
import { CrudService, SortOrder } from '../crud.service';
import { BaseI } from '../interfaces/base.interface';
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
  E extends BaseI,
  F = Partial<E>
> extends AsyncComponent {
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
    protected modal: ModalController
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

  override ionViewWillEnter() {
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

    const modal = await this.modal.create({
      component: ChoiceModalComponent,
      componentProps: { message },
    });

    modal.present();
    const { data } = await modal.onWillDismiss();

    if (!data) {
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
