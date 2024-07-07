import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, inject, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, filter, first } from 'rxjs';
import { PROJECT_NAME_MIN_LENGTH } from 'src/app/common/constants';
import { RxDoc } from 'src/app/db/db.model';
import { ProjectDocument } from 'src/app/db/entities/project.entity';
import { ProjectsRepository } from 'src/app/db/project.repository';
import { GtdPageLayout } from 'src/app/layout/layout.component';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  standalone: true,
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrl: './projects.page.scss',
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatBottomSheetModule,
    RouterLink,
    GtdPageLayout,
    ToolbarComponent
  ]
})
export class ProjectsPage implements OnInit {
  bottomSheet = inject(MatBottomSheet);
  navigation = inject(NavigationService);
  projectsRepository = inject(ProjectsRepository);

  projects$?: BehaviorSubject<RxDoc<ProjectDocument>[]>;

  constructor() {
    this.navigation.settings.next({
      toolbar: true,
      showSidenavBtn: true,
      toolbarHeader: 'projects.toolbar'
    });
  }
  ngOnInit(): void {
    this.projects$ = this.projectsRepository.observeAll();
  }

  addProject() {
    this.bottomSheet
      .open(CreateProjectSheet)
      .afterDismissed()
      .pipe(first(), filter(Boolean))
      .subscribe((name) => {
        this.projectsRepository.create({ name });
      });
  }
}

@Component({
  standalone: true,
  templateUrl: './create-project.sheet.html',
  styleUrl: './projects.page.scss',
  imports: [MatFormField, MatInput, ReactiveFormsModule, MatButtonModule, MatIcon]
})
export class CreateProjectSheet implements OnInit, AfterViewInit {
  nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  bottomSheet = inject(MatBottomSheetRef);

  projectName!: FormControl<string | null>;
  ngOnInit(): void {
    this.projectName = new FormControl(null, [
      Validators.required,
      Validators.minLength(PROJECT_NAME_MIN_LENGTH)
    ]);
  }
  ngAfterViewInit(): void {
    this.nameInput()?.nativeElement.focus();
  }

  confirm() {
    this.bottomSheet.dismiss(this.projectName.value);
  }
}
