import { ActionDocument } from 'src/app/db/entities/action.entity';
import { BaseRepository } from '../common/services/repository.base';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ActionsRepository extends BaseRepository<ActionDocument> {
  constructor() {
    super();
    this.collection = this.dbProvider.rxDatabase.actions;
  }
}
