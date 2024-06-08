import { Injectable } from "@angular/core";
import { BaseRepository } from "../common/services/repository.base";
import { InboxDocument } from "./entities/inbox.entity";

@Injectable({ providedIn: 'root'})
export class InboxRepository extends BaseRepository<InboxDocument> {
    constructor() {
        super();
        this.collection = this.dbProvider.rxDatabase.inbox;
    }
}