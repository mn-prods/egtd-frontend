import { inject } from "@angular/core";
import { serverTimestamp } from "@angular/fire/firestore";
import { MangoQuerySortDirection } from "rxdb";
import { filter, firstValueFrom } from "rxjs";
import { GtdDatabaseCollections } from "src/app/db/db.model";
import { v4 as uuid } from 'uuid';
import { RxdbProvider } from "./db.provider";

export class BaseRepository<CollName extends keyof GtdDatabaseCollections> {
    protected readonly dbProvider = inject(RxdbProvider)
    protected readonly collection!: GtdDatabaseCollections[CollName]

    constructor(collectionName: keyof GtdDatabaseCollections) {
        this.collection = this.dbProvider.getDatabaseCollection(collectionName)
    }

    observeAll(sortBy?: keyof GtdDatabaseCollections[CollName]['schema']['defaultValues'], sortDir: MangoQuerySortDirection = 'asc') {
        return this.collection.find({ selector: { _deleted: false } }).$
    }

    observePaginated(limit: number, skip: number) {
        return this.collection.find({ selector: { _deleted: false }, limit, skip }).$
    }

    observeOneById(id: string) {
        return this.collection.findOne({ selector: { id } }).$
    }

    getAll(sortBy?: keyof GtdDatabaseCollections[CollName]['schema']['defaultValues'], sortDir: MangoQuerySortDirection = 'asc') {
        return firstValueFrom(this.observeAll(sortBy, sortDir).pipe(filter(Boolean)));
    }

    getPaginated(limit: number, skip: number) {
        return firstValueFrom(this.observePaginated(limit, skip).pipe(filter(Boolean)));
    }

    getOneById(id: string) {
        return firstValueFrom(this.observeOneById(id).pipe(filter(Boolean)));
    }

    create(data: Omit<GtdDatabaseCollections[CollName]['schema']['defaultValues'], 'id'>) {
        return this.collection.insert({ ...data, _deleted: false, id: uuid(), serverTimestamp: serverTimestamp() });
    }

    async update(id: string, data: Partial<GtdDatabaseCollections[CollName]['schema']['defaultValues']>) {
        const element = await this.getOneById(id);

        if (!element) {
            throw new Error("Cannot update a document that does not exists, use `save` or create the document first")
        }

        if (element._deleted) {
            throw new Error("Cannot update a deleted document or delete a document in an update operation, use `delete`")
        }

        return this.collection.incrementalUpsert({ ...data, id })
    }

    save(data: Omit<GtdDatabaseCollections[CollName]['schema']['defaultValues'], 'id'> & { id?: string }) {
        if (!data.id) {
            data.id = uuid();
        }

        return this.collection.upsert(data);
    }

    delete(id: string) {
        this.collection.incrementalUpsert({ id, _deleted: true })
    }



}