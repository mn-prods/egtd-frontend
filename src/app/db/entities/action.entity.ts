import { RxCollection, RxJsonSchema } from 'rxdb';
import { InboxDocument } from './inbox.entity';
import { BaseGtdDocument } from 'src/app/common/interfaces/base.interface';
import { ObjectValues } from 'src/app/common/types/object-values.type';

export enum ActionType {
  do = 'do',
  wait = 'wait',
  schedule = 'schedule'
}

export enum ActionEnvironment {
  home = 'home',
  phone = 'phone',
  computer = 'computer',
  car = 'car',
  around = 'around'
}

export interface ActionDocument extends BaseGtdDocument {
  id: string;
  body: string;
  marked: boolean;
  inboxItem: Pick<InboxDocument, 'id' | 'body'>;
  order: number;
  type: ActionType | null;
  at: ActionEnvironment | null;
  _deleted?: boolean;
}

export type ActionCollection = RxCollection<ActionDocument>;

export const actionsSchema: RxJsonSchema<ActionDocument> = {
  title: 'action schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  indexes: ['order'],
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      maxLength: 100
    },
    body: {
      type: 'string'
    },
    marked: {
      type: 'boolean'
    },
    inboxItem: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        },
        body: {
          type: 'string'
        }
      }
    },
    type: {
      type: 'string',
      enum: [...Object.values(ActionType), null],
      default: null
    },
    at: {
      type: 'string',
      enum: [...Object.values(ActionEnvironment), null],
      default: null,
    },
    order: {
      type: 'number',
      multipleOf: 1,
      minimum: 1,
      maximum: 100
    },
    updatedAt: {
      type: 'number'
    },
    createdAt: {
      type: 'number'
    },
    _deleted: {
      type: 'boolean'
    }
  }
};
