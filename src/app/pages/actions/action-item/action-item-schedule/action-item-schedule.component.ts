import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, DestroyRef, OnInit, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { actionTypeIcons, DEFAULT_DEBOUNCE } from 'src/app/common/constants';
import { FormGroupValue } from 'src/app/common/types/form-group-value.type';
import { ActionDocument, Schedule } from 'src/app/db/entities/action.entity';
import { ActionItem } from '../action-item.interface';

@Component({
  standalone: true,
  selector: 'app-action-item-schedule',
  templateUrl: './action-item-schedule.component.html',
  styleUrls: ['./action-item-schedule.component.scss', '../action-item.component.scss'],
  imports: [
    MatFormField,
    MatInputModule,
    TextFieldModule,
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ]
})
export class ActionItemScheduleComponent implements ActionItem, OnInit {
  action = input.required<ActionDocument>();
  onScheduleChange = output<Partial<Schedule>>();

  destroyRef = inject(DestroyRef);

  schedule!: FormGroup<FormGroupValue<Schedule>>;

  public get icon() {
    return actionTypeIcons.schedule;
  }

  ngOnInit(): void {
    this.schedule = new FormGroup({
      to: new FormControl(this.action().schedule?.to || null),
      on: new FormControl(this.action().schedule?.on || null)
    });

    this.schedule.valueChanges
      .pipe(
        debounceTime(DEFAULT_DEBOUNCE),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.onScheduleChange.emit(value);
      });
  }
}
