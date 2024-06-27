import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, DestroyRef, OnInit, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormGroupValue } from 'src/app/common/types/form-group-value.type';
import { ActionDocument, Schedule } from 'src/app/db/entities/action.entity';

@Component({
  standalone: true,
  selector: 'app-action-item-schedule',
  templateUrl: './action-item-schedule.component.html',
  styleUrl: './action-item-schedule.component.scss',
  imports: [
    MatFormField,
    MatInputModule,
    TextFieldModule,
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ]
})
export class ActionItemScheduleComponent implements OnInit {
  action = input.required<ActionDocument>();
  onScheduleChange = output<Partial<Schedule>>();

  destroyRef = inject(DestroyRef);

  schedule!: FormGroup<FormGroupValue<Schedule>>;

  ngOnInit(): void {
    this.schedule = new FormGroup({
      to: new FormControl(),
      on: new FormControl()
    });

    this.schedule.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.onScheduleChange.emit(value);
      });
  }
}
