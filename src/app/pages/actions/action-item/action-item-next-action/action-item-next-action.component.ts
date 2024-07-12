import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { actionTypeIcons, DEFAULT_DEBOUNCE } from 'src/app/common/constants';
import { isNullOrUndefined } from 'src/app/common/value-check';
import { ActionDocument, ActionEnvironment } from 'src/app/db/entities/action.entity';
import { ActionEnvChipComponent } from '../action-env-chip/action-env-chip.component';
import { ActionItem } from '../action-item.interface';

@Component({
  standalone: true,
  selector: 'app-action-item-next-action',
  templateUrl: './action-item-next-action.component.html',
  styleUrls: ['./action-item-next-action.component.scss', '../action-item.component.scss'],
  imports: [
    MatFormFieldModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatInputModule,
    TextFieldModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    CommonModule,
    ActionEnvChipComponent
  ]
})
export class ActionItemNextActionComponent implements ActionItem, OnInit {
  destroyRef = inject(DestroyRef);

  item = input.required<ActionDocument>();
  onSelectEnvironment = output<ActionEnvironment>();
  onBodyChanged = output<string>();

  environments = ActionEnvironment;

  itemBody!: FormControl<string | null>;

  public get icon() {
    return actionTypeIcons.do;
  }

  ngOnInit(): void {
    this.itemBody = new FormControl<string>(this.item().body);

    this.itemBody.valueChanges
      .pipe(
        filter((body) => !isNullOrUndefined(body)),
        distinctUntilChanged(),
        debounceTime(DEFAULT_DEBOUNCE),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((body) => this.onBodyChanged.emit(body!));
  }
}
