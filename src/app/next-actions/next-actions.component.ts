import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, map, takeUntil } from 'rxjs';
import { ActionsRepository } from '../db/actions.repository';
import { ActionDocument } from '../db/entities/action.entity';
import { InboxDocument } from '../db/entities/inbox.entity';
import { NextActionItemComponent } from './next-action-item/next-action-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  destroyRef = inject(DestroyRef);

  nextActions$!: Observable<ActionDocument[]>;
  anItemIsEmpty$?: Observable<boolean>

  ngOnInit(): void {
    this.nextActions$ = this.actionsRepository.observeManyByInboxItem(this.inboxItem().id);
    this.anItemIsEmpty$ = this.nextActions$.pipe(
      map((items) => items.some(({ body }) => !body)),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  addNextAction() {
    const { body, id } = this.inboxItem();
    this.actionsRepository.create({
      body: '',
      inboxItem: { body, id },
      marked: false
    });
  }
}
