import { RxDatabase } from "rxdb";
import { InboxCollection } from "./entities/inbox.entity"

export type GtdDatabaseCollections = {
    inbox: InboxCollection;
};

export type GtdDatabase = RxDatabase<GtdDatabaseCollections>;