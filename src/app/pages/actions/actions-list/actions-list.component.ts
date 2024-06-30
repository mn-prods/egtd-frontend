import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, debounceTime, firstValueFrom, map, takeUntil, tap } from 'rxjs';
import { NextActionItemComponent } from '../action-item/action-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { ActionDocument, ActionType } from 'src/app/db/entities/action.entity';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { RxDoc } from 'src/app/db/db.model';

@Component({
  selector: 'app-actions-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    NextActionItemComponent,
    DragDropModule
  ],
  templateUrl: './actions-list.component.html',
  styleUrl: './actions-list.component.scss'
})
export class ActionsListComponent implements OnInit {
  actions$ = input.required<Observable<RxDoc<ActionDocument>[]>>();
  actionsRepository = inject(ActionsRepository);
  destroyRef = inject(DestroyRef);

  anyItemIsInvalid = output<boolean>();

  ngOnInit(): void {
    this.actions$()
      .pipe(
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
      )
      .subscribe((invalid) => {
        this.anyItemIsInvalid.emit(invalid);
      });
  }

  

  async reorder(event: CdkDragDrop<ActionDocument>) {
    let { currentIndex, previousIndex } = event;

    if (currentIndex === previousIndex) return;

    let action = await firstValueFrom(
      this.actions$().pipe(map((actions) => actions.at(previousIndex)))
    );

    if (!action) throw new Error(`No action at index ${previousIndex}`);

    await this.actionsRepository.reorder(action.id, currentIndex, previousIndex);
  }
}
