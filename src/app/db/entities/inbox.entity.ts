import { RxCollection } from "rxdb";
import { BaseGtdDocument } from "src/app/common/interfaces/base.interface";

export interface InboxDocument {
    id: string;
    body: string;
    marked: boolean;
    _deleted?: boolean;
}

export type InboxCollection = RxCollection<InboxDocument>