import { RxCollection, RxJsonSchema } from "rxdb";
import { InboxDocument } from "./inbox.entity";
import { BaseGtdDocument } from "src/app/common/interfaces/base.interface";

export interface ActionDocument extends BaseGtdDocument {
    id: string;
    body: string;
    marked: boolean;
    inboxItem: Pick<InboxDocument, 'id' | 'body'>
    _deleted?: boolean;
}

export type ActionCollection = RxCollection<ActionDocument>

export const actionsSchema: RxJsonSchema<ActionDocument> = {
    title: 'action schema',
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
            type: 'string',
        },
        marked: {
            type: 'boolean',
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
        updatedAt: {
            type: 'number'
        },
        createdAt: {
            type: 'number'
        },
        _deleted: {
            type: 'boolean'
        }
    },
};
