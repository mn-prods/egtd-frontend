import { Injectable, inject, isDevMode } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { RxDatabase, addRxPlugin, createRxDatabase } from 'rxdb';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { BehaviorSubject } from 'rxjs';
import { GtdDatabase, GtdDatabaseCollections } from 'src/app/db/db.model';
import { actionsSchema } from 'src/app/db/entities/action.entity';
import { InboxDocument, inboxSchema } from 'src/app/db/entities/inbox.entity';
import { ReplicationService } from './replication.service';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { projectsSchema } from 'src/app/db/entities/project.entity';

async function loadRxDBPlugins(): Promise<void> {
  addRxPlugin(RxDBMigrationPlugin);
  addRxPlugin(RxDBCleanupPlugin);
  addRxPlugin(RxDBLeaderElectionPlugin);
  addRxPlugin(RxDBUpdatePlugin);

  if (isDevMode()) {
    addRxPlugin(RxDBDevModePlugin);
  }
}

loadRxDBPlugins();

@Injectable({
  providedIn: 'root'
})
export class RxdbProvider {
  firestore = inject(Firestore);
  replicationService = inject(ReplicationService);

  public rxDatabase!: RxDatabase<GtdDatabaseCollections>;
  private dataBaseReadySubj = new BehaviorSubject<boolean>(false);
  public dataBaseReady$ = this.dataBaseReadySubj.asObservable();

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
      actions: {
        schema: actionsSchema,
        autoMigrate: false,
      },
      projects: {
        schema: projectsSchema,
        autoMigrate: false
      }
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

    const replicationState = replicateRxCollection<InboxDocument, any>({
      collection: collections.inbox,
      replicationIdentifier: 'inbox-http',
      live: true,
      push: {
        handler: async (changeRows) => {
          return this.replicationService.push('inbox', changeRows);
        }
      },
      pull: {
        handler: async (checkpoint, batchSize) => {
          const updatedAt = checkpoint ? checkpoint.updatedAt : 0;
          const id = checkpoint ? checkpoint.id : '';
          const data = await this.replicationService.pull('inbox', { updatedAt, id, batchSize });
          return {
            documents: data.documents,
            checkpoint: data.checkpoint
          };
        },
        stream$: this.replicationService.pullStream$.asObservable() as any
      }
    });
    this.replicationService.pullStream('inbox');

    // replicationState.active$.subscribe(console.log)
    // replicationState.sent$.subscribe(console.log)
    // replicationState.received$.subscribe(console.log)

    return this.rxDatabase;
  }
}
