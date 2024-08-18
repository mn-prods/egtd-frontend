import { Component, DestroyRef, inject, model, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, filter, switchMap } from 'rxjs';
import { actionTypeIcons } from 'src/app/common/constants';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { RxDoc } from 'src/app/db/db.model';
import { ActionDocument, ActionEnvironment } from 'src/app/db/entities/action.entity';
import { GtdPageLayout } from 'src/app/layout/layout.component';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';
import { ActionItem } from '../../action-item/action-item.interface';
import { ActionTypeButtonComponent } from '../../action-item/action-type-button/action-type-button.component';
import { ActionEnvChipComponent } from '../../action-item/action-env-chip/action-env-chip.component';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-next-action-detail',
  standalone: true,
  templateUrl: './next-action-detail.component.html',
  styleUrls: ['./next-action-detail.component.scss'],
  imports: [
    TranslateModule,
    ActionTypeButtonComponent,
    MatFormFieldModule,
    MatInput,
    GtdPageLayout,
    ToolbarComponent,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    ActionEnvChipComponent,
    MatMenuModule,
    CommonModule
  ]
})
export class NextActionDetailComponent implements ActionItem, OnInit {
  environments = ActionEnvironment;
  actionsRepository = inject(ActionsRepository);
  router = inject(Router);
  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  action = model.required<RxDoc<ActionDocument>>();
  nextActionBody!: FormControl<string | null>;

  get icon() {
    return actionTypeIcons.do;
  }

  async ngOnInit() {
    this.nextActionBody = new FormControl<string>(this.action().body);

    this.nextActionBody.valueChanges
      .pipe(
        filter(Boolean),
        debounceTime(200),
        switchMap((body) => {
          return this.actionsRepository.update(this.action().id, {
            body
          });
        }),

        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((updatedAction) => this.action.set(updatedAction));
  }

  setActionAt(at: ActionEnvironment) {
    this.actionsRepository.update(this.action().id, { at }).then(this.action.set);
  }

  setCompleted() {
    this.actionsRepository.update(this.action().id, { marked: true }).then(this.action.set);
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
