import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseRepository } from '../common/services/repository.base';
import { InboxCollection, InboxDocument } from './entities/inbox.entity';

@Injectable({ providedIn: 'root' })
export class InboxRepository extends BaseRepository<InboxDocument> {
  protected override collection!: InboxCollection;

  override setMiddleware(): void {}

  constructor() {
    super('inbox');
  }

  override observeAll() {
    return this.collection.find({
      selector: { _deleted: false },
      sort: [{ marked: 'asc' }, { createdAt: 'desc' }]
    }).$ as unknown as BehaviorSubject<InboxDocument[]>;
  }
}
