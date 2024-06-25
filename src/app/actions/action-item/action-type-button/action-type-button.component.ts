import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { fromEvent } from 'rxjs';
import {
  LongPressDirective,
  LongpressReleaseEvent
} from 'src/app/common/directives/long-press.directive';
import { ActionDocument, ActionType } from 'src/app/db/entities/action.entity';

@Component({
  selector: 'app-action-type-button',
  standalone: true,
  imports: [MatButtonModule, LongPressDirective, TranslateModule, MatIcon, CommonModule, MatRipple],
  templateUrl: './action-type-button.component.html',
  styleUrl: './action-type-button.component.scss'
})
export class ActionTypeButtonComponent implements OnInit {
  destroyRef = inject(DestroyRef);

  disabled = input<boolean>();
  action = input.required<ActionDocument>();
  onTypeChange = output<ActionType>();
  onLongPressing = output<number>();
  onReleasePressing = output<LongpressReleaseEvent>();

  pressedFor = signal<number>(0);

  ngOnInit(): void {
    this.onLongPressing.subscribe((n) => this.pressedFor.set(n));
  }

  toggleType(): void {
    let type = this.action().type;

    if (!type) this.onTypeChange.emit(ActionType.do);

    let types = Object.values(ActionType);
    let typeIdx = types.findIndex((t) => t === type);

    this.onTypeChange.emit(types[(typeIdx + 1) % types.length]);
  }

  simulateSuccessfulLongPress() {
    this.onReleasePressing.emit({ minTimeReached: true, maxTimeReached: true });
  }
}
