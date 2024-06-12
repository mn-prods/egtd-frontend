import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[longPress]',
  standalone: true,
})
export class LongPressDirective {

  pressing: boolean = false;
  longPressing: boolean = false;
  timeout: any;
  interval: any;

  delay = 50;
  elapsedTime = 0; // used for onLongPressing event

  @Input()
  minTime = 500; // used for onLongPress event

  @Input()
  maxTime = 2000; // used for onReleasePressing event

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onLongPress = new EventEmitter();

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onLongPressing: EventEmitter<number> = new EventEmitter();

  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onReleasePressing: EventEmitter<void> = new EventEmitter();

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
    this.pressing = true;
    this.longPressing = false;
    
    this.timeout = setTimeout(() => {
      this.longPressing = true;
      this.onLongPress.emit(event);
      this.interval = setInterval(() => {
        this.onLongPressing.emit(this.elapsedTime);
        if (this.elapsedTime < this.maxTime) {
          this.elapsedTime += this.delay;
        } else {
          this.end();
        }
      }, this.delay);
    }, this.minTime);
  }

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  endPress(event: MouseEvent): void {
    if (this.elapsedTime > this.minTime)  {
        event.preventDefault();
    }
    this.end();
  }

  end(): void {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
    this.longPressing = false;
    this.pressing = false;
    this.elapsedTime = 0;
    this.onReleasePressing.next();
  }

}