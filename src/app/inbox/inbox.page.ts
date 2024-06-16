import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, map, takeUntil } from 'rxjs';
import { InboxDocument } from '../db/entities/inbox.entity';
import { InboxRepository } from '../db/inbox.repository';
import { NavigationService } from '../navigation.service';
import { InboxItemComponent } from './inbox-item/inbox-item.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, InboxItemComponent, MatButtonModule, TranslateModule],
  templateUrl: './inbox.page.html',
  styleUrl: './inbox.page.scss',
})
export class InboxPage implements OnInit, OnDestroy {
  private readonly inboxRepository = inject(InboxRepository);
  private readonly navigation = inject(NavigationService);

  inboxItems$!: BehaviorSubject<InboxDocument[]>;

  anItemIsEmpty$!: Observable<boolean>;

  unsub$!: Subject<null>;

  constructor() {
    this.unsub$ = new Subject();
    this.navigation.settings.next({
      toolbar: true,
      toolbarHeader: 'inbox.toolbar',
      showSidenavBtn: true
    });
  }

  ngOnInit(): void {
    this.inboxItems$ = this.inboxRepository.observeAll();
    this.anItemIsEmpty$ = this.inboxItems$.pipe(
      map((items) => items.some(({ body }) => !body)),
      takeUntil(this.unsub$)
    );
  }

  addItem() {
    this.inboxRepository.create<'actionable'>({
      body: '',
      marked: false
    });
  }

  removeItem(id: string) {
    this.inboxRepository.delete(id);
  }

  ngOnDestroy(): void {
    this.unsub$.next(null);
    this.unsub$.complete();
    this.unsub$.unsubscribe();
  }
}
