import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, debounceTime, filter } from 'rxjs';
import { DEFAULT_DEBOUNCE, PROJECT_NAME_MIN_LENGTH, actionTypeIcons } from 'src/app/common/constants';
import { assert } from 'src/app/common/functions/assert';
import { FormGroupValue } from 'src/app/common/types/form-group-value.type';
import { isNullOrUndefined } from 'src/app/common/value-check';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { RxDoc } from 'src/app/db/db.model';
import { ActionDocument } from 'src/app/db/entities/action.entity';
import { ProjectDocument } from 'src/app/db/entities/project.entity';
import { ProjectsRepository } from 'src/app/db/project.repository';
import { GtdPageLayout } from 'src/app/layout/layout.component';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';

type FormValue = FormGroupValue<Pick<ProjectDocument, 'name' | 'details'>>;

@Component({
  standalone: true,
  templateUrl: './project-details.page.html',
  styleUrl: './project-details.page.scss',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInput,
    ReactiveFormsModule,
    TextFieldModule,
    TranslateModule,
    GtdPageLayout,
    ToolbarComponent,
    RouterModule,
    MatIcon
  ]
})
export class ProjectDetailsPage implements OnInit {
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  actionsRepository = inject(ActionsRepository);
  projectsRepository = inject(ProjectsRepository);

  constructor() {
    this.project = this.route.snapshot.data['project'];
  }

  project!: RxDoc<ProjectDocument>;

  projectForm!: FormGroup<FormValue>;

  projectActions$!: BehaviorSubject<RxDoc<ActionDocument>[]>;

  typeIcons = actionTypeIcons;

  ngOnInit(): void {
    assert(!isNullOrUndefined(this.project), 'Project should exists');

    this.projectActions$ = this.actionsRepository.observeManyByTypeAndProject(
      null,
      this.project.id
    );

    this.projectForm = new FormGroup<FormValue>({
      name: new FormControl(this.project!.name, [
        Validators.required,
        Validators.minLength(PROJECT_NAME_MIN_LENGTH)
      ]),
      details: new FormControl(this.project!.details)
    });

    this.projectForm.valueChanges
      .pipe(
        filter(() => this.projectForm.valid),
        debounceTime(DEFAULT_DEBOUNCE),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ name, details }) => {
        this.projectsRepository.update(this.project!.id, { name: name!, details });
      });
  }
}
