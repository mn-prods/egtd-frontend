import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ActionsRepository } from '../db/actions.repository';
import { ActionDocument } from '../db/entities/action.entity';
import { InboxDocument } from '../db/entities/inbox.entity';
import { NextActionItemComponent } from './next-action-item/next-action-item.component';

@Component({
  selector: 'app-next-actions',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, NextActionItemComponent],
  templateUrl: './next-actions.component.html',
  styleUrl: './next-actions.component.scss'
})
export class NextActionsComponent implements OnInit {
  inboxItem = input.required<InboxDocument>();
  actionsRepository = inject(ActionsRepository);

  nextActions$!: Observable<ActionDocument[]>;

  ngOnInit(): void {
    this.nextActions$ = this.actionsRepository.observeAll();
  }

  addNextAction() {
    const { body, id } = this.inboxItem();
    this.actionsRepository.create({
      body: 'asd',
      inboxItem: { body, id },
      marked: false
    });
  }
}
