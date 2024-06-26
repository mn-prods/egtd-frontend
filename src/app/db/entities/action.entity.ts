import { RxCollection, RxJsonSchema } from 'rxdb';
import { BaseGtdDocument } from 'src/app/common/interfaces/base.interface';
import { InboxDocument } from './inbox.entity';

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

export type Waiting = {
  for: string | null;
  to: string | null;
  by: Date | null;
};

export type Schedule = {
  to: string | null;
  on: Date | null;
};

export interface ActionDocument extends BaseGtdDocument {
  id: string;
  body: string;
  marked: boolean;
  inboxItem: Pick<InboxDocument, 'id' | 'body'>;
  order: number;
  type: ActionType | null;
  at: ActionEnvironment | null;
  wait: Partial<Waiting> | null;
  schedule: Partial<Schedule> | null;
  typeIsFinal: boolean;
  _deleted?: boolean;
}

export type ActionCollection = RxCollection<ActionDocument>;

export const actionsSchema: RxJsonSchema<ActionDocument> = {
  keyCompression: false,
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
    wait: {
      type: 'object',
      default: null,
      properties: {
        for: { type: 'string' },
        to: { type: 'string' },
        by: { type: 'number' }
      }
    },
    schedule: {
      type: 'object',
      default: null,
      properties: {
        to: { type: 'string' },
        on: { type: 'number' }
      }
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
      default: null
    },
    order: {
      type: 'number',
      multipleOf: 1,
      minimum: 1,
      maximum: 100
    },
    typeIsFinal: {
      type: 'boolean',
      default: false
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
