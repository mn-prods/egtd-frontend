import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CheckboxChangeEventDetail,
  CheckboxCustomEvent,
  IonModal,
} from '@ionic/angular';
import { IonViewWillEnter } from '../common/interfaces/ionic-lifecycle.interface';
import { InboxItem, InboxItemStatus } from './inbox-item.dto';
import { InboxService } from './inbox.service';

// export type InboxItemForm = {
//   [K in keyof InboxItem]: FormControl<InboxItem[K] | null | undefined>;
// };

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements IonViewWillEnter {
  @ViewChild(IonModal) modal?: IonModal;

  constructor(private inbox: InboxService) {}

  newItem = new FormControl<string | null>(null, [Validators.required]);

  items: InboxItem[] = [];

  showCompleted = true;

  async ionViewWillEnter() {
    this.items = await this.inbox.getItems();
  }

  async createInboxItem(label: string | null) {
    if (!label) return;

    this.newItem.reset();

    this.items.push(await this.inbox.createItem(label));
  }

  async openCloseItem(itemId: string, { detail }: CheckboxCustomEvent) {
    const status: InboxItemStatus = detail.checked
      ? InboxItemStatus.closed
      : InboxItemStatus.open;

    this.inbox.changeItemStatus(itemId, status);
  }
}
