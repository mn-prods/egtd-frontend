import { RxDatabase, RxDocument } from "rxdb";
import { InboxCollection } from "./entities/inbox.entity"
import { ActionCollection } from "./entities/action.entity";
import { ProjectCollection } from "./entities/project.entity";

export type GtdDatabaseCollections = {
    inbox: InboxCollection;
    actions: ActionCollection;
    projects: ProjectCollection
};

export type GtdDatabase = RxDatabase<GtdDatabaseCollections>;

export type RxDoc<T> = RxDocument<T, {}>