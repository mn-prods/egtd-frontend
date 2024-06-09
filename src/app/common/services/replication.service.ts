import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RxReplicationWriteToMasterRow, WithDeleted } from 'rxdb';
import { firstValueFrom } from 'rxjs';

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
  private readonly http = inject(HttpClient);

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
      this.http.post<WithDeleted<D>[]>(`http://localhost:3000/${collection}/replication/push`, rows, {
        headers
      })
    );
  }
}
