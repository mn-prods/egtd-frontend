import { RxCollection, RxJsonSchema } from 'rxdb';
import { BaseGtdDocument } from 'src/app/common/interfaces/base.interface';

export interface InboxDocument extends BaseGtdDocument {
  id: string;
  body: string;
  marked: boolean;
  actionable: boolean;
  project: string;
  updatedAt: number;
  createdAt: number;
  _deleted?: boolean;
}

export type InboxCollection = RxCollection<InboxDocument>;

export const inboxSchema: RxJsonSchema<InboxDocument> = {
  keyCompression: false,
  title: 'inbox schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
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
    actionable: {
      type: 'boolean',
      default: null
    },
    project: {
      type: 'string',
      format: 'uuid',
      ref: 'projects'
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
