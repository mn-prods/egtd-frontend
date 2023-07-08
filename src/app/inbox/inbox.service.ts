import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { headers } from '../common/constants';
import { CreateInboxDto } from './create-inbox-item.dto';
import { InboxItem } from './inbox-item.dto';

const endpoint = `${environment.api}/inbox`;

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  constructor(private http: HttpClient) {}

  getItems(): Promise<InboxItem[]> {
    return firstValueFrom(this.http.get<InboxItem[]>(endpoint, { headers }));
  }

  createItem(label: string): Promise<InboxItem> {
    const createInboxItemDto: CreateInboxDto = {
      label,
    };

    return firstValueFrom(
      this.http.post<InboxItem>(endpoint, createInboxItemDto, { headers })
    );
  }
}
