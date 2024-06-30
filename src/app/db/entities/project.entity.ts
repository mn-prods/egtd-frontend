import { RxCollection, RxJsonSchema } from 'rxdb';
import { BaseGtdDocument } from 'src/app/common/interfaces/base.interface';

export interface ProjectDocument extends BaseGtdDocument {
  name: string;
  details?: string | null;
}

export type ProjectCollection = RxCollection<ProjectDocument>;

export const projectsSchema: RxJsonSchema<ProjectDocument> = {
  keyCompression: false,
  title: 'project schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      maxLength: 100
    },
    name: { type: 'string' },
    details: { type: 'string' },
    updatedAt: { type: 'number' },
    createdAt: { type: 'number' },
    _deleted: { type: 'boolean' }
  }
};
