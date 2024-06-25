import { inject } from '@angular/core';
import { MangoQuerySortDirection, RxCollection, RxDocument } from 'rxdb';
import { BehaviorSubject, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { BaseGtdDocument } from '../interfaces/base.interface';
import { RxdbProvider } from './db.provider';
import { GtdDatabaseCollections } from 'src/app/db/db.model';

export abstract class BaseRepository<D extends BaseGtdDocument> {
  protected readonly dbProvider = inject(RxdbProvider);
  protected collection!: RxCollection;

  constructor(coll: keyof GtdDatabaseCollections) {
    this.collection = this.dbProvider.rxDatabase[coll];
    this.setMiddleware();
  }
  abstract setMiddleware(): void;

  protected preFetch(doc: D): void {}

  observeAll(
    sortBy: keyof D = 'createdAt',
    sortDir: MangoQuerySortDirection = 'desc'
  ): BehaviorSubject<D[]> {
    return this.collection
      .find({ selector: { _deleted: false }, sort: [{ [sortBy]: sortDir }] })
      .$.pipe(tap((docs) => docs.map((d) => this.preFetch(d)))) as BehaviorSubject<D[]>;
  }

  observePaginated(
    limit: number,
    skip: number,
    sortBy: keyof D = 'createdAt',
    sortDir: MangoQuerySortDirection = 'desc'
  ): BehaviorSubject<D[]> {
    return this.collection
      .find({
        selector: { _deleted: false },
        limit,
        skip,
        sort: [{ [sortBy]: sortDir }]
      })
      .$.pipe(tap((docs) => docs.map((d) => this.preFetch(d)))) as BehaviorSubject<D[]>;
  }

  observeOneById(id: string): BehaviorSubject<D> {
    return this.collection
      .findOne({ selector: { id } })
      .$.pipe(tap((doc) => this.preFetch(doc))) as BehaviorSubject<D>;
  }

  getAll(sortBy: keyof D = 'createdAt', sortDir: MangoQuerySortDirection = 'desc'): Promise<D[]> {
    return this.collection
      .find({ selector: { _deleted: false }, sort: [{ [sortBy]: sortDir }] })
      .exec()
      .then((docs) => {
        docs.forEach((doc) => this.preFetch(doc));
        return docs;
      });
  }

  async getPaginated(
    limit: number,
    skip: number,
    sortBy: keyof D = 'createdAt',
    sortDir: MangoQuerySortDirection = 'desc'
  ): Promise<D[]> {
    return this.collection
      .find({ selector: { _deleted: false }, limit, skip, sort: [{ [sortBy]: sortDir }] })
      .exec()
      .then((docs) => {
        docs.forEach((doc) => this.preFetch(doc));
        return docs;
      });
  }

  async getOneById(id: string): Promise<D> {
    return this.collection
      .findOne({ selector: { id } })
      .exec()
      .then((doc) => {
        this.preFetch(doc);
        return doc;
      });
  }

  async create<Ignore extends string = ''>(
    data: Omit<D, keyof BaseGtdDocument | Ignore>
  ): Promise<D> {
    let now = +new Date();
    return this.collection
      .insert({
        id: uuid(),
        createdAt: now,
        updatedAt: now,
        ...data
      })
      .then((doc) => {
        this.preFetch(doc);
        return doc;
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

    return document.incrementalPatch({ ...data, id, updatedAt: +new Date() }).then((doc) => {
      this.preFetch(doc);
      return doc;
    });
  }

  async save(data: Omit<D, 'id'> & { id?: string }): Promise<D> {
    if (!data.id) {
      data.id = uuid();
    }

    data.updatedAt = +new Date();

    return this.collection.upsert(data).then((doc) => {
      this.preFetch(doc);
      return doc;
    });
  }

  async delete(id: string): Promise<void> {
    await this.collection.incrementalUpsert({ id, _deleted: true, updatedAt: +new Date() });
  }
}
