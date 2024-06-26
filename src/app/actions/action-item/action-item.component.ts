import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { LongpressReleaseEvent } from 'src/app/common/directives/long-press.directive';
import { ActionsRepository } from 'src/app/db/actions.repository';
import {
  ActionDocument,
  ActionEnvironment,
  ActionType,
  Schedule,
  Waiting
} from 'src/app/db/entities/action.entity';
import { ActionEnvChipComponent } from './action-env-chip/action-env-chip.component';
import { ActionItemNextActionComponent } from './action-item-next-action/action-item-next-action.component';
import { ActionTypeButtonComponent } from './action-type-button/action-type-button.component';
import { ActionItemWaitForComponent } from './action-item-wait-for/action-item-wait-for.component';
import { ActionItemScheduleComponent } from './action-item-schedule/action-item-schedule.component';

@Component({
  selector: 'app-action-item',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    DragDropModule,
    TranslateModule,
    ActionTypeButtonComponent,
    ActionEnvChipComponent,
    ActionItemNextActionComponent,
    ActionItemWaitForComponent,
    ActionItemScheduleComponent
  ],
  templateUrl: './action-item.component.html',
  styleUrl: './action-item.component.scss'
})
export class NextActionItemComponent implements OnInit, AfterViewInit, OnDestroy {
  item = input.required<ActionDocument>();

  itemElem = viewChild<ElementRef<HTMLInputElement>>('itemInput');

  dialog = inject(MatDialog);
  actionsRepository = inject(ActionsRepository);
  router = inject(Router);

  unsub$!: Subject<null>;

  itemMarked!: FormControl<boolean | null>;
  itemType!: FormControl<ActionType | null>;

  itemSelected = signal(0);

  actionType = ActionType;
  typeIcons = {
    [ActionType.wait]: 'hourglass_top',
    [ActionType.schedule]: 'event',
    [ActionType.do]: 'commit'
  };

  deleteItem(id: string) {
    this.actionsRepository.delete(id);
  }

  ngOnInit(): void {
    this.unsub$ = new Subject();
    this.itemMarked = new FormControl<boolean>(this.item().marked);
    this.itemType = new FormControl<ActionType | null>(this.item().type);
  }

  ngAfterViewInit(): void {
    if (!this.item().body) this.itemElem()?.nativeElement.focus();
  }

  setNextType(type: ActionType): void {
    if (this.item().typeIsFinal) return;

    this.actionsRepository.update(this.item().id, { type });
  }

  updatePressionProgressive(event: number) {
    this.itemSelected.set(event);
  }

  updateActionEnvironment(at: ActionEnvironment) {
    this.actionsRepository.update(this.item().id, { at });
  }

  updateActionBody(body: string) {
    this.actionsRepository.update(this.item().id, { body });
  }
  updateActionWait(wait: Partial<Waiting>) {
    this.actionsRepository.update(this.item().id, { wait });
  }

  updateSchedule(schedule: Partial<Schedule>) {
    this.actionsRepository.update(this.item().id, { schedule });
  }

  goToNextActionDetail({ maxTimeReached }: LongpressReleaseEvent) {
    this.itemSelected.set(0);
    if (maxTimeReached) {
      this.actionsRepository.update(this.item().id, { typeIsFinal: true });
      this.router.navigate(['actions', this.item().id]);
    }
  }
  ngOnDestroy(): void {
    this.unsub$.next(null);
    this.unsub$.unsubscribe();
  }
}
