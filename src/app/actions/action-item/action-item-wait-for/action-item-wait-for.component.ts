import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  inject,
  input,
  output,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormGroupValue } from 'src/app/common/types/form-group-value.type';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { ActionDocument, Waiting } from 'src/app/db/entities/action.entity';

@Component({
  standalone: true,
  selector: 'app-action-item-wait-for',
  templateUrl: './action-item-wait-for.component.html',
  styleUrl: './action-item-wait-for.component.scss',
  imports: [
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatIconButton,
    TranslateModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ]
})
export class ActionItemWaitForComponent implements OnInit {
  waitSubj = viewChild<ElementRef<HTMLInputElement>>('waitSubj');

  action = input.required<ActionDocument>();
  onWaitChanged = output<Partial<Waiting>>();

  actionRepository = inject(ActionsRepository);
  destroyRef = inject(DestroyRef);

  waitingFor!: FormGroup<FormGroupValue<Waiting>>;

  ngOnInit(): void {
    this.waitingFor = new FormGroup({
      for: new FormControl(this.action().wait?.for || null, [Validators.required]),
      to: new FormControl(this.action().wait?.to || null, [Validators.required]),
      by: new FormControl(this.action().wait?.by || null, [Validators.required])
    });

    this.waitingFor.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((wait) => this.onWaitChanged.emit(wait));
  }

  focusOnWaitSubj() {
    this.waitSubj()?.nativeElement.focus();
  }
}
