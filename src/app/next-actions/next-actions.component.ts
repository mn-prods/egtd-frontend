import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, map, takeUntil, tap } from 'rxjs';
import { ActionsRepository } from '../db/actions.repository';
import { ActionDocument } from '../db/entities/action.entity';
import { InboxDocument } from '../db/entities/inbox.entity';
import { NextActionItemComponent } from './next-action-item/next-action-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-next-actions',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    NextActionItemComponent,
    DragDropModule
  ],
  templateUrl: './next-actions.component.html',
  styleUrl: './next-actions.component.scss'
})
export class NextActionsComponent implements OnInit {
  inboxItem = input.required<InboxDocument>();
  actionsRepository = inject(ActionsRepository);
  destroyRef = inject(DestroyRef);

  nextActions$!: Observable<ActionDocument[]>;
  anyItemIsInvalid$?: Observable<boolean>;

  ngOnInit(): void {
    this.nextActions$ = this.actionsRepository.observeManyByInboxItem(this.inboxItem().id);

    this.anyItemIsInvalid$ = this.nextActions$.pipe(
      map((items: ActionDocument[]) => items.some(({ body, type }) => !body || !type)),
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

  reorder(event: any) {
    console.log(event)
  }
}
