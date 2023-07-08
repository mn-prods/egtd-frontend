import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { headers } from '../common/constants';
import { CreateInboxDto } from './create-inbox-item.dto';
import { InboxItem, InboxItemStatus } from './inbox-item.dto';

const endpoint = `${environment.api}/inbox`;

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  constructor(private http: HttpClient) {}

  getItems(): Promise<InboxItem[]> {
    return firstValueFrom(
      this.http
        .get<InboxItem[]>(endpoint, { headers })
        .pipe(
          map((items) =>
            items
              .map((item) => this.castItem(item))
              .sort((i1, i2) => +i1.created - +i2.created)
          )
        )
    );
  }

  createItem(label: string): Promise<InboxItem> {
    const createInboxItemDto: CreateInboxDto = {
      label,
    };

    return firstValueFrom(
      this.http
        .post<InboxItem>(endpoint, createInboxItemDto, { headers })
        .pipe(map((item) => this.castItem(item)))
    );
  }

  async changeItemStatus(
    itemId: string,
    status: InboxItemStatus
  ): Promise<boolean> {
    return firstValueFrom(
      this.http.patch<boolean>(
        `${endpoint}/${itemId}/status`,
        { status },
        { headers }
      )
    );
  }

  private castItem(item: InboxItem): InboxItem {
    return {
      ...item,
      isClosed: item.status === InboxItemStatus.closed,
      created: new Date(item.created),
      modified: new Date(item.modified),
    };
  }
}
