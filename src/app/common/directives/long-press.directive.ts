import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

export type LongpressReleaseEvent = {
  minTimeReached: boolean;
  maxTimeReached: boolean;
};

@Directive({
  selector: '[longPress]',
  standalone: true
})
export class LongPressDirective {
  pressing = false;
  longPressing = false;
  timeout: any;
  interval: any;

  private elapsedTime = 0; // used for onLongPressing event

  @Input()
  longPressEnabled = true;

  @Input()
  precision = 50;

  @Input()
  minTime = 500; // used for onLongPress event

  @Input()
  maxTime = 2000; // used for onReleasePressing event

  @Input()
  emitOnMaxTimeReached = false;

  @Output()
  onLongPress = new EventEmitter();

  @Output()
  onLongPressing = new EventEmitter<number>();

  @Output()
  onReleasePressing = new EventEmitter<LongpressReleaseEvent>();

  @HostBinding('class.press')
  get press(): boolean {
    return this.pressing;
  }

  @HostBinding('class.longpress')
  get longPress(): boolean {
    return this.longPressing;
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.longPressEnabled) return;

    this.pressing = true;
    this.longPressing = false;

    this.interval = setInterval(() => {
      if (this.elapsedTime < this.maxTime) {
        this.elapsedTime += this.precision;
        this.onLongPressing.emit(this.elapsedTime);
      } else if (this.emitOnMaxTimeReached) {
        this.end();
      }
    }, this.precision);

    this.timeout = setTimeout(() => {
      this.longPressing = true;
      this.onLongPress.emit(event);
    }, this.minTime);
  }

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  endPress(event: MouseEvent): void {
    if (!this.longPressEnabled) return;
    if (this.elapsedTime > this.minTime) {
      event.preventDefault();
    }
    this.end();
  }

  end(): void {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
    this.onReleasePressing.next({
      minTimeReached: this.longPressing,
      maxTimeReached: this.elapsedTime >= this.maxTime
    });
    this.longPressing = false;
    this.pressing = false;
    this.elapsedTime = 0;
    this.onLongPressing.emit(0)
  }
}
