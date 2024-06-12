import { Injectable } from '@angular/core';
import { ActionCollection, ActionDocument } from 'src/app/db/entities/action.entity';
import { BaseRepository } from '../common/services/repository.base';
import { BaseGtdDocument } from '../common/interfaces/base.interface';
import { v4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class ActionsRepository extends BaseRepository<ActionDocument> {
  protected override collection: ActionCollection;

  constructor() {
    super();
    this.collection = this.dbProvider.rxDatabase.actions;
  }

  observeManyByInboxItem(inboxItemId: string) {
    return this.collection.find({
      selector: { 'inboxItem.id': inboxItemId, _deleted: false },
      sort: [{ order: 'desc' }]
    }).$;
  }

  override async create(
    data: Omit<ActionDocument, keyof BaseGtdDocument | 'order' | 'type'>
  ): Promise<ActionDocument> {
    let now = +new Date();

    const lastAction = await this.collection
      .findOne({
        selector: { _deleted: false, 'inboxItem.id': data.inboxItem.id },
        sort: [{ order: 'desc' }]
      })
      .exec();

    return this.collection.insert({
      id: v4(),
      createdAt: now,
      updatedAt: now,
      order: (lastAction?.order || 0) + 1,
      type: null,
      ...data
    });
  }
}
