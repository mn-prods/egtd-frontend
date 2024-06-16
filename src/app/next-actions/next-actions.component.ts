import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, debounceTime, firstValueFrom, map, takeUntil, tap } from 'rxjs';
import { ActionsRepository } from '../db/actions.repository';
import { ActionDocument } from '../db/entities/action.entity';
import { InboxDocument } from '../db/entities/inbox.entity';
import { NextActionItemComponent } from './next-action-item/next-action-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

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

  async addNextAction() {
    let { body, id } = this.inboxItem();

    let order = await this.actionsRepository.getNextOrder(id);
    this.actionsRepository.create<'type' | 'at'>({
      body: '',
      inboxItem: { body, id },
      marked: false,
      order
    });
  }

  async reorder(event: CdkDragDrop<ActionDocument>) {
    let { currentIndex, previousIndex } = event;

    if (currentIndex === previousIndex) return;

    let action = await firstValueFrom(
      this.nextActions$.pipe(map((actions) => actions.at(previousIndex)))
    );

    if (!action) throw new Error(`No action at index ${previousIndex}`);

    await this.actionsRepository.reorder(action.id, currentIndex, previousIndex);
  }
}
