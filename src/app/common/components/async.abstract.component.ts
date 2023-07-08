import { Subject } from 'rxjs';
import {
    IonViewDidEnter
} from '../interfaces/ionic-lifecycle.interface';

export abstract class AsyncComponent implements IonViewDidEnter {
  unsubscribe$!: Subject<null>;

  instantiateUnsubscribe() {
    this.unsubscribe$ = new Subject<null>();
  }

  ionViewDidEnter() {
    this.instantiateUnsubscribe();
  }
}
