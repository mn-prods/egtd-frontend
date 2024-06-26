import { RxDatabase, RxDocument } from "rxdb";
import { InboxCollection } from "./entities/inbox.entity"
import { ActionCollection } from "./entities/action.entity";

export type GtdDatabaseCollections = {
    inbox: InboxCollection;
    actions: ActionCollection
};

export type GtdDatabase = RxDatabase<GtdDatabaseCollections>;

export type RxDoc<T> = RxDocument<T, {}>