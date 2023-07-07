import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CrudService,
  NullablePartial,
  SortOrder
} from '../common/crud.service';
import { PaginatedResult } from '../common/interfaces/paginates-result.interface';
import { User } from '../common/interfaces/user.interface';

const endpoint = `${environment.api}/users`;

@Injectable({
  providedIn: 'root',
})
export class UserService extends CrudService<User> {
  constructor(private http: HttpClient) {
    super();
  }

  get(id: string): Observable<User> {
    return this.http.get<User>(`${endpoint}/${id}`);
  }

  find(
    filter: NullablePartial<User> | undefined,
    page: number,
    size: number,
    sortField: keyof User | undefined,
    sortOrder: SortOrder | undefined
  ): Observable<PaginatedResult<User>> {
    throw new Error('Method not implemented.');
  }

  save(id: string, dto: NullablePartial<User> | null): Observable<User> {
    if (!dto) {
      return this.http.post<User>(`${environment.api}/users/${id}`, {});
    }
    return this.http.put<User>(`${environment.api}/users/${id}`, dto);
  }
  delete(id: string): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
