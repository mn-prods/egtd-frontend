import { Injectable } from '@angular/core';
import { BaseRepository } from '../common/services/repository.base';
import { InboxDocument } from './entities/inbox.entity';
import { MangoQuerySortDirection } from 'rxdb';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InboxRepository extends BaseRepository<InboxDocument> {
  constructor() {
    super();
    this.collection = this.dbProvider.rxDatabase.inbox;
  }

  override observeAll(): BehaviorSubject<InboxDocument[]> {
    return this.collection.find({
      selector: { _deleted: false },
      sort: [{ marked: 'asc' }, { createdAt: 'desc' }]
    }).$;
  }
}
