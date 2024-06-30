import { Component, OnInit, inject, input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { RxDoc } from 'src/app/db/db.model';
import { ActionDocument } from 'src/app/db/entities/action.entity';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { ActionsListComponent } from '../actions-list/actions-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  templateUrl: './actions-list-inbox.component.html',
  selector: 'app-inbox-actions-list',
  imports: [ActionsListComponent, TranslateModule, CommonModule, MatButtonModule]
})
export class InboxActionsListComponent implements OnInit {
  inboxItem = input.required<InboxDocument>();

  actionsRepository = inject(ActionsRepository);

  inboxItemActions$!: Observable<RxDoc<ActionDocument>[]>;

  anyItemIsInvalid$ = new Subject<boolean>();

  ngOnInit(): void {
    this.inboxItemActions$ = this.actionsRepository.observeManyByInboxItem(this.inboxItem().id);
  }

  async addNextAction() {
    let { id } = this.inboxItem();

    let order = await this.actionsRepository.getNextOrder(id);
    this.actionsRepository.create<'type' | 'at' | 'typeIsFinal' | 'wait' | 'schedule'>({
      body: '',
      inboxItem: id,
      marked: false,
      order
    });
  }
}
