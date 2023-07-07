import { Subject } from "rxjs"

export abstract class AsyncComponent {

    unsubscribe$!: Subject<null>;

    instantiateUnsubscribe() {
        this.unsubscribe$ = new Subject<null>();
    }

    ionViewWillEnter() {
        this.instantiateUnsubscribe();
    }
}