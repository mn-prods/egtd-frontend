import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { NavigationService } from 'src/app/navigation.service';
import { NextActionsComponent } from 'src/app/next-actions/next-actions.component';

@Component({
  selector: 'app-inbox-action-choice',
  standalone: true,
  imports: [MatButtonToggleModule, MatButtonModule, MatIcon, TranslateModule, NextActionsComponent],
  templateUrl: './inbox-action-choice.component.html',
  styleUrl: './inbox-action-choice.component.scss'
})
export class InboxActionChoiceComponent implements OnInit {
  route = inject(ActivatedRoute);
  navigation = inject(NavigationService);

  item?: InboxDocument;

  constructor() {
    this.navigation.settings.next({ toolbar: true, showBackBtn: true, backBtnRoute: 'inbox' });
  }

  ngOnInit(): void {
    this.item = this.route.snapshot.data['item'];
  }

  saveItemState(actionable: boolean) {
    // save inbox item state
  }
}
