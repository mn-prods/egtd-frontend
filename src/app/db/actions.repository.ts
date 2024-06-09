import { Injectable } from '@angular/core';
import { ActionCollection, ActionDocument } from 'src/app/db/entities/action.entity';
import { BaseRepository } from '../common/services/repository.base';

@Injectable({ providedIn: 'root' })
export class ActionsRepository extends BaseRepository<ActionDocument> {
  protected override collection: ActionCollection;

  constructor() {
    super();
    this.collection = this.dbProvider.rxDatabase.actions;
  }

  observeManyByInboxItem(inboxItemId: string) {
    return this.collection.find({ selector: { 'inboxItem.id': inboxItemId, _deleted: false } }).$;
  }
}
