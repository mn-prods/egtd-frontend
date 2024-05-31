import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: '',
  template: '',
})
export abstract class AsyncComponent implements OnInit {
  unsubscribe$!: Subject<null>;

  instantiateUnsubscribe() {
    this.unsubscribe$ = new Subject<null>();
  }

  ngOnInit() {
    this.instantiateUnsubscribe();
  }
}
