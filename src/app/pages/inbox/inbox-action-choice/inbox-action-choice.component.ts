import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { assert } from 'src/app/common/functions/assert';

import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { InboxRepository } from 'src/app/db/inbox.repository';
import { NavigationService } from 'src/app/navigation.service';
import { NextActionsComponent } from 'src/app/pages/actions/next-actions.component';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { RxDoc } from 'src/app/db/db.model';
import { ProjectDocument } from 'src/app/db/entities/project.entity';
import { ProjectsRepository } from 'src/app/db/project.repository';

@Component({
  selector: 'app-inbox-action-choice',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIcon,
    TranslateModule,
    NextActionsComponent,
    MatFormField,
    MatSelectModule
  ],
  templateUrl: './inbox-action-choice.component.html',
  styleUrl: './inbox-action-choice.component.scss'
})
export class InboxActionChoiceComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  navigation = inject(NavigationService);
  inboxRepository = inject(InboxRepository);
  projectsRepository = inject(ProjectsRepository);

  item?: InboxDocument;
  projects$?: BehaviorSubject<RxDoc<ProjectDocument>[]>;

  constructor() {
    this.navigation.settings.next({
      toolbar: true,
      showBackBtn: true,
      backBtnRoute: 'inbox',
      toolbarHeader: 'inbox-choice.toolbar'
    });
  }

  ngOnInit(): void {
    this.item = this.route.snapshot.data['item'];
    this.projects$ = this.projectsRepository.observeAll( 'name', 'asc' );
  }

  saveItemState(actionable: boolean) {
    assert(this.item?.id !== undefined, 'Item should not be undefined, something went wrong');

    this.inboxRepository.update(this.item!.id, { actionable });
  }

  markAsComplete() {
    this.inboxRepository.update(this.item!.id, { marked: true });
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
