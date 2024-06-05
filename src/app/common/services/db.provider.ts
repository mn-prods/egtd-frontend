import { Injectable, inject, isDevMode } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { RX_META_SCHEMA, RxDatabase, RxJsonSchema, addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { replicateFirestore } from 'rxdb/plugins/replication-firestore';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { BehaviorSubject } from 'rxjs';
import { GtdDatabase, GtdDatabaseCollections } from 'src/app/db/db.model';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { environment } from 'src/environments/environment';

RX_META_SCHEMA

const inboxSchema: RxJsonSchema<InboxDocument> = {
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
            type: 'string',
        },
        marked: {
            type: 'boolean',
        },
        _deleted: {
            type: 'boolean'
        }
    },
};

async function loadRxDBPlugins(): Promise<void> {
    // addRxPlugin(RxDBAttachmentsPlugin);
    // addRxPlugin(RxDBUpdatePlugin);
    addRxPlugin(RxDBMigrationPlugin);
    addRxPlugin(RxDBCleanupPlugin);
    addRxPlugin(RxDBLeaderElectionPlugin);

    if (isDevMode()) {
        addRxPlugin(RxDBDevModePlugin);
    }
}

loadRxDBPlugins();

@Injectable({
    providedIn: 'root',
})
export class RxdbProvider {
    firestore = inject(Firestore)

    private rxDatabase!: RxDatabase<GtdDatabaseCollections>;
    private dataBaseReadySubj = new BehaviorSubject<boolean>(false);
    public dataBaseReady$ = this.dataBaseReadySubj.asObservable();

    public getDatabaseCollection(collectionName: keyof GtdDatabaseCollections) {
        if (!this.rxDatabase) {
            throw new Error(
                'Database is not initialized. Please make sure the database is initialized before getting the collection',
            );
        }
        return this.rxDatabase[collectionName];
    }

    public async initDB(name: string): Promise<RxDatabase<GtdDatabaseCollections>> {
        if (this.rxDatabase && this.rxDatabase.name === name && !this.rxDatabase.destroyed) {
            return this.rxDatabase;
        }

        this.rxDatabase = await createRxDatabase<GtdDatabase>({
            name,
            storage: getRxStorageDexie(),
            cleanupPolicy: {}
        });

        const collections = await this.rxDatabase.addCollections({
            inbox: {
                schema: inboxSchema,
                autoMigrate: false,
                migrationStrategies: {
                    // 1: () => {}
                }
            },
        });

        this.dataBaseReadySubj.next(true);

        const needed = await collections.inbox.migrationNeeded();
        if (needed) {
            await collections.inbox.startMigration(10); // 10 is the batch-size, how many docs will run at parallel
        }

        // const replicationState = replicateFirestore({

        //     collection: collections.inbox,
        //     replicationIdentifier: 'inbox',
        //     autoStart: true,
        //     live: true,
        //     pull: {},
        //     push: {},
        //     firestore: {
        //         database: this.firestore,
        //         collection: collection(this.firestore, 'inbox'),
        //         projectId: environment.firebase.appId
        //     },
        // })


        // replicationState.active$.subscribe(console.log)
        // replicationState.sent$.subscribe(console.log)
        // replicationState.received$.subscribe(console.log)

        return this.rxDatabase;
    }
}