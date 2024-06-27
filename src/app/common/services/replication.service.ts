import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { SseClient } from 'ngx-sse-client';
import { RxReplicationWriteToMasterRow, WithDeleted } from 'rxdb';
import {
  BehaviorSubject,
  Subject,
  catchError,
  filter,
  first,
  firstValueFrom,
  from,
  of,
  switchMap
} from 'rxjs';

let headers = new HttpHeaders()
  .set('Accept', 'application/json')
  .set('Content-Type', 'application/json');

export type PullResponse = {
  checkpoint: any;
  documents: any[];
};

export type PullData = {
  updatedAt: number;
  id: string;
  batchSize: number;
};

@Injectable({ providedIn: 'root' })
export class ReplicationService {
  pullStream$ = new Subject();

  private readonly http = inject(HttpClient);
  private readonly sseClient = inject(SseClient);
  private readonly auth = inject(Auth);

  async pull(collection: string, pullData: PullData): Promise<PullResponse> {
    const { updatedAt, id, batchSize } = pullData;
    const params = new HttpParams()
      .set('updatedAt', updatedAt)
      .set('id', id)
      .set('batchSize', batchSize);

    return firstValueFrom(
      this.http.get<PullResponse>(`http://localhost:3000/${collection}/replication/pull`, {
        params
      })
    );
  }

  async push<D>(
    collection: string,
    rows: RxReplicationWriteToMasterRow<D>[]
  ): Promise<WithDeleted<D>[]> {
    return firstValueFrom(
      this.http.post<WithDeleted<D>[]>(
        `http://localhost:3000/${collection}/replication/push`,
        rows,
        {
          headers
        }
      )
    );
  }

  async pullStream(collection: string) {
    const token = new BehaviorSubject<string>('');
    this.auth.onAuthStateChanged(async (d) => {
      let tk = await d?.getIdToken();
      if (tk) token.next(tk);
    });

    from(token)
      .pipe(
        filter(Boolean),
        first(),
        switchMap((_) => {
          return this.sseClient.stream(
            `http://localhost:3000/${collection}/replication/pull/stream`,
            { keepAlive: true, reconnectionDelay: 1_000, responseType: 'text' },
            { headers },
            'GET'
          );
        }),
        catchError((err) => {
          console.log('catched error', err);
          return of();
        })
      )
      .subscribe((rawEvent) => {
        let event = JSON.parse(rawEvent);
        this.pullStream$.next({
          documents: event.documents,
          checkpoint: event.checkpoint
        });
      });
  }
}
