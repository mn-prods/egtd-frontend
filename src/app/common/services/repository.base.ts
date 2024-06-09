import { inject } from '@angular/core';
import { MangoQuerySortDirection, MangoQuerySortPart, RxCollection, RxDocument } from 'rxdb';
import { GtdDatabaseCollections } from 'src/app/db/db.model';
import { v4 as uuid } from 'uuid';
import { RxdbProvider } from './db.provider';
import { BehaviorSubject } from 'rxjs';
import { BaseGtdDocument } from '../interfaces/base.interface';

type CollName = keyof GtdDatabaseCollections;

export class BaseRepository<D extends BaseGtdDocument> {
  protected readonly dbProvider = inject(RxdbProvider);
  protected collection!: RxCollection;

  observeAll(sortBy?: keyof D, sortDir: MangoQuerySortDirection = 'asc'): BehaviorSubject<D[]> {
    return this.collection.find({ selector: { _deleted: false } }).$;
  }

  observePaginated(limit: number, skip: number): BehaviorSubject<D[]> {
    return this.collection.find({ selector: { _deleted: false }, limit, skip }).$;
  }

  observeOneById(id: string): BehaviorSubject<D> {
    return this.collection.findOne({ selector: { id } }).$;
  }

  getAll(sortBy?: MangoQuerySortPart<D>[], sortDir: MangoQuerySortDirection = 'asc'): Promise<D[]> {
    return this.collection.find({ selector: { _deleted: false } }).exec();
  }

  async getPaginated(limit: number, skip: number): Promise<D[]> {
    return this.collection.find({ selector: { _deleted: false }, limit, skip }).exec();
  }

  async getOneById(id: string): Promise<D> {
    return this.collection.findOne({ selector: { id } }).exec();
  }

  async create(data: Omit<D, keyof BaseGtdDocument>): Promise<D> {
    return this.collection.insert({
      id: uuid(),
      createdAt: +new Date(),
      updatedAt: +new Date(),
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

    data.updatedAt = +new Date()

    return this.collection.upsert(data);
  }

  async delete(id: string): Promise<void> {
    await this.collection.incrementalUpsert({ id, _deleted: true, updatedAt: +new Date() });
  }
}
