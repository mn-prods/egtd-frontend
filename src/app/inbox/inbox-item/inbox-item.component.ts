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
import { Subject, debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { InboxRepository } from '../../db/inbox.repository';

@Component({
  selector: 'app-inbox-item',
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
  templateUrl: './inbox-item.component.html',
  styleUrl: './inbox-item.component.scss'
})
export class InboxItemComponent implements OnInit, AfterViewInit, OnDestroy {
  item = input.required<InboxDocument>();
  itemElem = viewChild<ElementRef<HTMLInputElement>>('itemInput');

  dialog = inject(MatDialog);
  inboxRepository = inject(InboxRepository);
  router = inject(Router);

  unsub$!: Subject<null>;

  itemBody!: FormControl<string | null>;
  itemMarked!: FormControl<boolean | null>;

  deleteItem(id: string) {
    this.inboxRepository.delete(id);
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
        switchMap((body) => this.inboxRepository.update(this.item().id, { body })),
        takeUntil(this.unsub$)
      )
      .subscribe();

    this.itemMarked.valueChanges.pipe(
      takeUntil(this.unsub$),
      map(marked => marked || false),
      switchMap((marked) => this.inboxRepository.update(this.item().id, { marked }))
    ).subscribe();
  }

  ngAfterViewInit(): void {
    if (!this.item().body) this.itemElem()?.nativeElement.focus();
  }

  goToChoice() {
    this.router.navigate(['inbox', this.item().id]);
  }

  ngOnDestroy(): void {
    this.unsub$.next(null);
    this.unsub$.unsubscribe();
  }
}
