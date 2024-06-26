import { Injectable } from '@angular/core';
import { ActionCollection, ActionDocument } from 'src/app/db/entities/action.entity';
import { BaseRepository } from '../common/services/repository.base';
import { firstValueFrom, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActionsRepository extends BaseRepository<ActionDocument> {
  protected override collection!: ActionCollection;

  constructor() {
    super('actions');
  }

  override setMiddleware(): void {
    const convertDatesToTimestamp = (data: ActionDocument) => {
      if (data.wait?.by) {
        data.wait.by = +data.wait.by as unknown as Date;
      }

      if (data.schedule?.on) {
        data.schedule.on = +data.schedule.on as unknown as Date;
      }
    };

    this.collection.preInsert(convertDatesToTimestamp, true);
    this.collection.preSave(convertDatesToTimestamp, true);

    this.collection.postCreate((plainData, rxDoc) => {
      Object.defineProperty(rxDoc, 'wait', {
        get: () => {
          if (!plainData.wait?.by) return plainData.wait;
          return { ...plainData.wait, by: new Date(plainData.wait.by) };
        }
      });
      Object.defineProperty(rxDoc, 'schedule', {
        get: () => {
          if (!plainData.schedule?.on) return plainData.schedule;
          return { ...plainData.schedule, on: new Date(plainData.schedule.on) };
        }
      });
    });
  }

  observeManyByInboxItem(inboxItemId: string) {
    return this.collection.find({
      selector: { 'inboxItem': inboxItemId, _deleted: false },
      sort: [{ order: 'desc' }]
    }).$;
  }

  getNextOrder(inboxItemId: string): Promise<number> {
    return firstValueFrom(
      this.collection
        .findOne({
          selector: { 'inboxItem': inboxItemId, _deleted: false },
          sort: [{ order: 'desc' }]
        })
        .$.pipe(map((action) => (action?.order || 0) + 1))
    );
  }

  async reorder(id: string, currentIndex: number, previousIndex: number): Promise<void> {
    let diff = Math.abs(currentIndex - previousIndex);

    let action = await this.collection.findOne(id).exec(true);

    let previousOrder = action.order;
    let currentOrder: number;

    // drag up
    if (currentIndex < previousIndex) {
      currentOrder = previousOrder + diff;
      // compute order values from indexes
      this.collection
        // find affected actions from order values
        .find({
          selector: {
            $and: [{ order: { $gt: previousOrder } }, { order: { $lte: currentOrder } }]
          }
        })
        // decrement order values of affected actions
        .update({ $inc: { order: -1 } });
    }

    // drag down
    if (currentIndex > previousIndex) {
      // compute current order value from indexes
      currentOrder = previousOrder - diff;
      this.collection
        // find affected actions from order values
        .find({
          selector: {
            $and: [{ order: { $lt: previousOrder } }, { order: { $gte: currentOrder } }]
          }
        })
        // increment order values of affected actions
        .update({ $inc: { order: 1 } });
    }
    // set dragged action to new position
    await action.patch({ order: currentOrder! });
  }
}
