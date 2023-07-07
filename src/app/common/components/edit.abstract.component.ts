import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first, map, Observable, of, switchMap, tap } from 'rxjs';
import { ID_PLACEHOLDER, URLPARAM_ID_KEY } from '../constants';
import { CrudService } from '../crud.service';
import { AsyncComponent } from './async.abstract.component';

@Component({
  selector: '',
  template: '',
})
export abstract class EditComponent<
  E,
  O extends Partial<keyof E>
> extends AsyncComponent {
  @Input() entity: E | undefined | null;

  form!: FormGroup<{
    [K in keyof Required<Omit<E, O>>]: FormControl<E[K] | null>;
  }>;

  constructor(
    protected route: ActivatedRoute,
    private crudService: CrudService<E>
  ) {
    super();
  }

  retrieveEntityById(): Observable<E | null> {
    return this.route.paramMap.pipe(
      first(),
      map((paramMap) => {
        return paramMap.get(URLPARAM_ID_KEY);
      }),
      switchMap((id) => {
        if (!id || id === ID_PLACEHOLDER) {
          return of(null);
        }
        return this.crudService.get(id);
      }),
      first(),
      tap((entity) => {
        this.entity = entity;
      })
    );
  }
}
