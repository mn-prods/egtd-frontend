import { Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { ActionsListComponent } from './actions-list/actions-list.component';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { ActionDocument, ActionType } from 'src/app/db/entities/action.entity';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/navigation.service';
import { BehaviorSubject, Subject, startWith, switchMap, tap } from 'rxjs';
import { RxDoc } from 'src/app/db/db.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormGroupValue } from 'src/app/common/types/form-group-value.type';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { ProjectsRepository } from 'src/app/db/project.repository';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectDocument } from 'src/app/db/entities/project.entity';

type ActionsFilter = { type?: ActionType; project?: string };

@Component({
  standalone: true,
  templateUrl: './actions.page.html',
  styleUrl: 'actions.page.scss',
  imports: [
    ActionsListComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ]
})
export class ActionsPage implements OnInit {
  type = input<ActionType>();
  project = input<string>();

  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  navigation = inject(NavigationService);
  actionsRepository = inject(ActionsRepository);
  projectsRepository = inject(ProjectsRepository);

  readonly types = ActionType;

  constructor() {
    this.navigation.settings.next({
      toolbar: true,
      showSidenavBtn: true,
      toolbarHeader: 'next-actions.toolbar'
    });
  }

  projects?: RxDoc<ProjectDocument>[];

  selectedProjectName$ = new Subject<RxDoc<ProjectDocument> | undefined>();

  actions$ = new BehaviorSubject<RxDoc<ActionDocument>[]>([]);

  actionsFilter!: FormGroup<FormGroupValue<ActionsFilter>>;

  ngOnInit(): void {
    this.actionsFilter = new FormGroup<FormGroupValue<ActionsFilter>>({
      type: new FormControl(this.type()),
      project: new FormControl(this.project())
    });

    this.projectsRepository
      .observeAll('name', 'asc')
      .pipe(
        switchMap((projects) => {
          this.projects = projects;
          return this.actionsFilter.valueChanges.pipe(startWith(this.actionsFilter.value));
        }),
        tap(({ project }) => {
          this.selectedProjectName$.next(this.projects!.find(({ id }) => id === project));
        }),
        switchMap(({ type, project }) =>
          this.actionsRepository.observeManyByTypeAndProject(type, project)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((actions) => {
        this.actions$?.next(actions);
      });
  }

  setProjectFilter(project: string | null) {
    this.actionsFilter.patchValue({ project });
  }
}