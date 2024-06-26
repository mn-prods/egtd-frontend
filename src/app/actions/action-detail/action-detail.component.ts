import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActionDocument, ActionType } from 'src/app/db/entities/action.entity';
import { NavigationService } from 'src/app/navigation.service';
import { WaitForDetailComponent } from './wait-for-detail/wait-for-detail.component';
import { RxDoc } from 'src/app/db/db.model';

@Component({
  selector: 'app-action-detail',
  standalone: true,
  imports: [WaitForDetailComponent],
  templateUrl: './action-detail.component.html',
  styleUrl: './action-detail.component.scss'
})
export class ActionDetailComponent implements OnInit {
  navigation = inject(NavigationService);
  route = inject(ActivatedRoute);

  action = signal<RxDoc<ActionDocument> | null>(null);

  actionBody!: FormControl<string | null>;
  actionTypes = ActionType;

  constructor() {
    this.navigation.settings.next({
      showBackBtn: true,
      toolbar: true,
      toolbarHeader: ''
    });
  }

  ngOnInit(): void {
    this.action.set(this.route.snapshot.data['action']);

    this.actionBody = new FormControl<string>(this.action()!.body);

    this.navigation.updateSetting({ backBtnRoute: `inbox/${this.action()?.inboxItem}` });
  }
}
