import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { IonViewWillEnter } from '../common/interfaces/ionic-lifecycle.interface';
import { InboxItem } from './inbox-item.dto';
import { InboxService } from './inbox.service';

export type InboxItemForm = {
  [K in keyof InboxItem]: FormControl<InboxItem[K] | null | undefined>;
};

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

  async ionViewWillEnter() {
    this.items = await this.inbox.getItems();
  }

  async createInboxItem(label: string | null) {
    if (!label) return;

    const newItem = await this.inbox.createItem(label);
    this.items.push(newItem);
  }

  createInboxItemCtrl(item: Partial<InboxItem>): FormGroup<InboxItemForm> {
    return new FormGroup<InboxItemForm>({
      id: new FormControl(item?.id),
      status: new FormControl(item?.status),
      label: new FormControl(item?.label),
    });
  }
}
