import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { assert } from 'src/app/common/functions/assert';

import { CommonModule } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { RxDoc } from 'src/app/db/db.model';
import { ActionDocument } from 'src/app/db/entities/action.entity';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { ProjectDocument } from 'src/app/db/entities/project.entity';
import { InboxRepository } from 'src/app/db/inbox.repository';
import { ProjectsRepository } from 'src/app/db/project.repository';
import { GtdPageLayout } from 'src/app/layout/layout.component';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';
import { ActionsListComponent } from '../../actions/actions-list/actions-list.component';

@Component({
  selector: 'app-inbox-action-choice',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIcon,
    TranslateModule,
    MatFormField,
    GtdPageLayout,
    ToolbarComponent,
    ActionsListComponent,
    MatMenuModule
  ],
  templateUrl: './inbox-action-choice.component.html',
  styleUrl: './inbox-action-choice.component.scss'
})
export class InboxActionChoiceComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  inboxRepository = inject(InboxRepository);
  actionsRepository = inject(ActionsRepository);
  projectsRepository = inject(ProjectsRepository);
  selectedProject?: string | null;

  item!: InboxDocument;

  projects$?: BehaviorSubject<RxDoc<ProjectDocument>[]>;
  inboxItemActions$!: Observable<RxDoc<ActionDocument>[]>;
  anyItemIsInvalid$ = new Subject<boolean>();

  ngOnInit(): void {
    this.item = this.route.snapshot.data['item'];

    assert(this.item?.id !== undefined, 'Item should not be undefined, something went wrong');

    this.projects$ = this.projectsRepository.observeAll('name', 'asc');

    this.inboxItemActions$ = this.actionsRepository.observeManyByInboxItem(this.item.id);
  }

  saveItemState(actionable: boolean) {
    this.inboxRepository.update(this.item.id, { actionable });
  }

  assingToProject(project: string | null) {
    this.selectedProject = project;
    this.inboxRepository.update(this.item.id, { project });
    this.actionsRepository.setProjectToAllInboxItemActions(this.item.id, project);
  }

  markAsComplete() {
    this.inboxRepository.update(this.item.id, { marked: true });
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  async addNextAction() {
    let { id } = this.item;

    let order = await this.actionsRepository.getNextOrder(id);
    this.actionsRepository.create<'type' | 'at' | 'typeIsFinal' | 'wait' | 'schedule'>({
      body: '',
      inboxItem: id,
      marked: false,
      order,
      project: this.selectedProject
    });
  }
}
