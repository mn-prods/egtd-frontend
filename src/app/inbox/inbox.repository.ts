import { Injectable } from "@angular/core";
import { BaseRepository } from "../common/services/repository.base";

@Injectable({ providedIn: 'root' })
export class InboxRepository extends BaseRepository<'inbox'> {

    constructor() {
        super('inbox')
    }

}