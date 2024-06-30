import { Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { ActionsListComponent } from './actions-list/actions-list.component';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { ActionDocument, ActionType } from 'src/app/db/entities/action.entity';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/navigation.service';
import { BehaviorSubject, startWith, switchMap, tap } from 'rxjs';
import { RxDoc } from 'src/app/db/db.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormGroupValue } from 'src/app/common/types/form-group-value.type';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';

type ActionsFilter = { type?: ActionType; project?: string };

@Component({
  standalone: true,
  templateUrl: './actions.page.html',
  styleUrl: 'actions.page.scss',
  imports: [ActionsListComponent, MatButtonToggleModule, ReactiveFormsModule, TranslateModule]
})
export class ActionsPage implements OnInit {
  type = input<ActionType>();
  project = input<string>();

  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  navigation = inject(NavigationService);
  actionsRepository = inject(ActionsRepository);

  readonly types = ActionType;

  constructor() {
    this.navigation.settings.next({
      toolbar: true,
      showSidenavBtn: true,
      toolbarHeader: 'actions.toolbar'
    });
  }

  actions$ = new BehaviorSubject<RxDoc<ActionDocument>[]>([]);

  actionsFilter!: FormGroup<FormGroupValue<ActionsFilter>>;

  ngOnInit(): void {
    this.actionsFilter = new FormGroup<FormGroupValue<ActionsFilter>>({
      type: new FormControl(this.type()),
      project: new FormControl(this.project())
    });

    this.actionsFilter.valueChanges
      .pipe(
        startWith(this.actionsFilter.value),
        switchMap(({ type, project }) => {
          return this.actionsRepository.observeManyByTypeAndProject(type, project);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((actions) => {
        this.actions$?.next(actions);
      });
  }
}
