import { inject } from '@angular/core';
import { MangoQuerySortDirection, RxCollection, RxDocument } from 'rxdb';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { BaseGtdDocument } from '../interfaces/base.interface';
import { RxdbProvider } from './db.provider';

export class BaseRepository<D extends BaseGtdDocument> {
  protected readonly dbProvider = inject(RxdbProvider);
  protected collection!: RxCollection;

  observeAll(
    sortBy: keyof D = 'createdAt',
    sortDir: MangoQuerySortDirection = 'desc'
  ): BehaviorSubject<D[]> {
    return this.collection.find({ selector: { _deleted: false }, sort: [{ [sortBy]: sortDir }] }).$;
  }

  observePaginated(
    limit: number,
    skip: number,
    sortBy: keyof D = 'createdAt',
    sortDir: MangoQuerySortDirection = 'desc'
  ): BehaviorSubject<D[]> {
    return this.collection.find({
      selector: { _deleted: false },
      limit,
      skip,
      sort: [{ [sortBy]: sortDir }]
    }).$;
  }

  observeOneById(id: string): BehaviorSubject<D> {
    return this.collection.findOne({ selector: { id } }).$;
  }

  getAll(sortBy: keyof D = 'createdAt', sortDir: MangoQuerySortDirection = 'desc'): Promise<D[]> {
    return this.collection
      .find({ selector: { _deleted: false }, sort: [{ [sortBy]: sortDir }] })
      .exec();
  }

  async getPaginated(
    limit: number,
    skip: number,
    sortBy: keyof D = 'createdAt',
    sortDir: MangoQuerySortDirection = 'desc'
  ): Promise<D[]> {
    return this.collection
      .find({ selector: { _deleted: false }, limit, skip, sort: [{ [sortBy]: sortDir }] })
      .exec();
  }

  async getOneById(id: string): Promise<D> {
    return this.collection.findOne({ selector: { id } }).exec();
  }

  async create<Ignore extends string = ''>(data: Omit<D, keyof BaseGtdDocument | Ignore>): Promise<D> {
    let now = +new Date();
    return this.collection.insert({
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      ...data
    });
  }

  async update(id: string, data: Partial<D>) {
    const element = await this.getOneById(id);

    if (!element) {
      throw new Error(
        'Cannot update a document that does not exists, use `save` or create the document first'
      );
    }

    if (element._deleted) {
      throw new Error(
        'Cannot update a deleted document or delete a document in an update operation, use `delete`'
      );
    }

    const document: RxDocument<D> = await this.collection.findOne(id).exec();

    return document.incrementalPatch({ ...data, id, updatedAt: +new Date() });
  }

  async save(data: Omit<D, 'id'> & { id?: string }): Promise<D> {
    if (!data.id) {
      data.id = uuid();
    }

    data.updatedAt = +new Date();

    return this.collection.upsert(data);
  }

  async delete(id: string): Promise<void> {
    await this.collection.incrementalUpsert({ id, _deleted: true, updatedAt: +new Date() });
  }
}
