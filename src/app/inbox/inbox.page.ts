import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Signal, inject } from '@angular/core';
import { RxDocument } from 'rxdb';
import { BehaviorSubject, Observable, Subject, map, takeUntil } from 'rxjs';
import { InboxDocument } from '../db/entities/inbox.entity';
import { InboxItemComponent } from './inbox-item/inbox-item.component';
import { InboxRepository } from './inbox.repository';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, InboxItemComponent, MatButtonModule],
  templateUrl: './inbox.page.html',
  styleUrl: './inbox.page.scss'
})
export class InboxPage implements OnInit, OnDestroy {
  private readonly repository = inject(InboxRepository)

  inboxItems$!: BehaviorSubject<RxDocument<InboxDocument, {}>[]>

  anItemIsEmpty$!: Observable<boolean>

  unsub$!: Subject<null>;

  ngOnInit(): void {
    this.unsub$ = new Subject()
    this.inboxItems$ = this.repository.observeAll();
    this.anItemIsEmpty$ = this.inboxItems$.pipe(map(items => items.some(({ body }) => !body)), takeUntil(this.unsub$))
  }

  addItem() {
    this.repository.create({
      body: '',
      marked: false,
    })
  }

  removeItem(id: string) {
    this.repository.delete(id);
  }


  ngOnDestroy(): void {
    this.unsub$.next(null);
    this.unsub$.complete();
    this.unsub$.unsubscribe();
  }

}
