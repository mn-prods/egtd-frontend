import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, filter, tap } from 'rxjs';
import { DEFAULT_DEBOUNCE, PROJECT_NAME_MIN_LENGTH } from 'src/app/common/constants';
import { assert } from 'src/app/common/functions/assert';
import { FormGroupValue } from 'src/app/common/types/form-group-value.type';
import { isNullOrUndefined } from 'src/app/common/value-check';
import { RxDoc } from 'src/app/db/db.model';
import { ProjectDocument } from 'src/app/db/entities/project.entity';
import { ProjectsRepository } from 'src/app/db/project.repository';
import { NavigationService } from 'src/app/navigation.service';

type FormValue = FormGroupValue<Pick<ProjectDocument, 'name' | 'details'>>;

@Component({
  standalone: true,
  templateUrl: './project-details.page.html',
  styleUrl: './project-details.page.scss',
  imports: [MatFormFieldModule, MatInput, ReactiveFormsModule, TextFieldModule, TranslateModule]
})
export class ProjectDetailsPage implements OnInit {
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  navigation = inject(NavigationService);
  projectsRepository = inject(ProjectsRepository);

  constructor() {
    this.project = this.route.snapshot.data['project'];

    this.navigation.settings.next({
      toolbar: true,
      showBackBtn: true,
      backBtnRoute: 'projects',
      toolbarHeader: `Project: ${this.project!.name}`
    });
  }

  project!: RxDoc<ProjectDocument>;

  projectForm!: FormGroup<FormValue>;

  ngOnInit(): void {
    assert(!isNullOrUndefined(this.project), 'Project should exists');

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
        tap(({ name }) => this.navigation.updateSetting({ toolbarHeader: `Project: ${name}` })),
        debounceTime(DEFAULT_DEBOUNCE),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ name, details }) => {
        this.projectsRepository.update(this.project!.id, { name: name!, details });
      });
  }
}
