import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { RxDoc } from 'src/app/db/db.model';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { InboxRepository } from 'src/app/db/inbox.repository';
import { GtdPageLayout } from 'src/app/layout/layout.component';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';
import { InboxItemComponent } from './inbox-item/inbox-item.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    InboxItemComponent,
    MatButtonModule,
    TranslateModule,
    ToolbarComponent,
    GtdPageLayout
  ],
  templateUrl: './inbox.page.html',
  styleUrl: './inbox.page.scss'
})
export class InboxPage implements OnInit {
  private readonly inboxRepository = inject(InboxRepository);
  private readonly destroyRef = inject(DestroyRef);

  inboxItems$!: BehaviorSubject<RxDoc<InboxDocument>[]>;

  anItemIsEmpty$!: Observable<boolean>;

  ngOnInit(): void {
    this.inboxItems$ = this.inboxRepository.observeAll();
    this.anItemIsEmpty$ = this.inboxItems$.pipe(
      map((items) => items.some(({ body }) => !body)),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  addItem() {
    this.inboxRepository.create<'actionable' | 'project'>({
      body: '',
      marked: false
    });
  }

  removeItem(id: string) {
    this.inboxRepository.delete(id);
  }
}
