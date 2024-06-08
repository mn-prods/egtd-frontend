import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  input,
  viewChild
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { InboxRepository } from '../../db/inbox.repository';
import { ActionDocument } from 'src/app/db/entities/action.entity';
import { ActionsRepository } from 'src/app/db/actions.repository';

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
    RouterModule
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

  deleteItem(id: string) {
    this.actionsRepository.delete(id);
  }

  ngOnInit(): void {
    this.unsub$ = new Subject();
    this.itemBody = new FormControl<string>(this.item().body);
    this.itemMarked = new FormControl<boolean>(this.item().marked);

    this.itemBody.valueChanges
      .pipe(
        filter(Boolean),
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((body) => this.actionsRepository.update(this.item().id, { body })),
        takeUntil(this.unsub$)
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    if (!this.item().body) this.itemElem()?.nativeElement.focus();
  }

  goToChoice() {
    // this.router.navigate(['inbox', this.item().id]);
  }

  ngOnDestroy(): void {
    this.unsub$.next(null);
    this.unsub$.unsubscribe();
  }
}
