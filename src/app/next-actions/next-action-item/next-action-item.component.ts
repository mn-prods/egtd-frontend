import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextFieldModule } from '@angular/cdk/text-field';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs';
import {
  LongPressDirective,
  LongpressReleaseEvent
} from 'src/app/common/directives/long-press.directive';
import { isNullOrUndefined } from 'src/app/common/value-check';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { ActionDocument, ActionEnvironment, ActionType } from 'src/app/db/entities/action.entity';

@Component({
  selector: 'app-next-action-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterModule,
    TextFieldModule,
    LongPressDirective,
    MatBadgeModule,
    DragDropModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule
  ],
  templateUrl: './next-action-item.component.html',
  styleUrl: './next-action-item.component.scss'
})
export class NextActionItemComponent implements OnInit, AfterViewInit, OnDestroy {
  item = input.required<ActionDocument>();

  itemElem = viewChild<ElementRef<HTMLInputElement>>('itemInput');

  dialog = inject(MatDialog);
  actionsRepository = inject(ActionsRepository);
  router = inject(Router);

  unsub$!: Subject<null>;

  itemBody!: FormControl<string | null>;
  itemMarked!: FormControl<boolean | null>;
  itemType!: FormControl<ActionType | null>;

  itemSelected = signal(0);

  typeIcons = {
    [ActionType.wait]: 'hourglass_top',
    [ActionType.schedule]: 'event',
    [ActionType.do]: 'commit'
  };
  environments = ActionEnvironment;

  deleteItem(id: string) {
    this.actionsRepository.delete(id);
  }

  ngOnInit(): void {
    this.unsub$ = new Subject();
    this.itemBody = new FormControl<string>(this.item().body);
    this.itemMarked = new FormControl<boolean>(this.item().marked);
    this.itemType = new FormControl<ActionType | null>(this.item().type);

    this.itemBody.valueChanges
      .pipe(
        filter((body) => !isNullOrUndefined(body)),
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((body) => this.actionsRepository.update(this.item().id, { body: body! })),
        takeUntil(this.unsub$)
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    if (!this.item().body) this.itemElem()?.nativeElement.focus();
  }

  setNextType(): void {
    const type = this.toggleType();
    this.actionsRepository.update(this.item().id, { type });
  }

  toggleType(): ActionType {
    let type = this.item().type;
    if (!type) return ActionType.do;

    let types = Object.values(ActionType);
    let typeIdx = types.findIndex((t) => t === type);

    return types[(typeIdx + 1) % types.length];
  }

  ngOnDestroy(): void {
    this.unsub$.next(null);
    this.unsub$.unsubscribe();
  }
  onLongPressing(event: number) {
    this.itemSelected.set(event);
  }

  selectEnvironment(at: ActionEnvironment) {
    this.actionsRepository.update(this.item().id, { at });
  }

  goToNextActionDetail({ maxTimeReached }: LongpressReleaseEvent) {
    console.log('navigate away:', maxTimeReached);
    this.itemSelected.set(0);
  }
}
