import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, debounceTime, firstValueFrom, map, takeUntil, tap } from 'rxjs';
import { NextActionItemComponent } from './action-item/action-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { ActionDocument, ActionType } from 'src/app/db/entities/action.entity';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { RxDoc } from 'src/app/db/db.model';

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

  nextActions$!: Observable<RxDoc<ActionDocument>[]>;
  anyItemIsInvalid$?: Observable<boolean>;

  ngOnInit(): void {
    this.nextActions$ = this.actionsRepository.observeManyByInboxItem(this.inboxItem().id);

    this.anyItemIsInvalid$ = this.nextActions$.pipe(
      map((items: ActionDocument[]) =>
        items.some((action) => {
          if (!action.type) return true;

          switch (action.type) {
            case ActionType.do:
              return !action.body;
            case ActionType.wait:
              return !action.wait?.by || !action.wait?.for || !action.wait?.to;
            case ActionType.schedule:
              return !action.schedule?.on || !action.schedule?.to;

            default:
              return false;
          }
        })
      ),
      takeUntilDestroyed(this.destroyRef)
    );
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
