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
import { MatFormField } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { RxDoc } from 'src/app/db/db.model';
import { ProjectDocument } from 'src/app/db/entities/project.entity';
import { ProjectsRepository } from 'src/app/db/project.repository';
import { InboxActionsListComponent } from '../../actions/actions-list-inbox/actions-list-inbox.component';
import { ActionsRepository } from 'src/app/db/actions.repository';

@Component({
  selector: 'app-inbox-action-choice',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIcon,
    TranslateModule,
    InboxActionsListComponent,
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
  actionsRepository = inject(ActionsRepository);
  projectsRepository = inject(ProjectsRepository);
  selectedProject?: string;

  item!: InboxDocument;
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

    assert(this.item?.id !== undefined, 'Item should not be undefined, something went wrong');
    
    this.projects$ = this.projectsRepository.observeAll('name', 'asc');
  }

  saveItemState(actionable: boolean) {
    this.inboxRepository.update(this.item.id, { actionable });
  }

  assingProjectToItemAndActions({ value: project }: MatSelectChange) {
    this.selectedProject = project;
    this.inboxRepository.update(this.item.id, { project });
    this.actionsRepository.setProjectToAllInboxItemActions(this.item.id, project);
  }

  markAsComplete() {
    this.inboxRepository.update(this.item.id, { marked: true });
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
