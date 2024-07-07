import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { RxDoc } from 'src/app/db/db.model';
import { ActionDocument, ActionType } from 'src/app/db/entities/action.entity';
import { NextActionItemComponent } from '../action-item/action-item.component';

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
