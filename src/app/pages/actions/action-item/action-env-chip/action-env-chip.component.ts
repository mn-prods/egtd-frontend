import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ActionEnvironment } from 'src/app/db/entities/action.entity';

@Component({
  selector: 'app-action-env-chip',
  standalone: true,
  templateUrl: './action-env-chip.component.html',
  styleUrls: ['./action-env-chip.component.scss'],
  imports: [MatIcon, TranslateModule]
})
export class ActionEnvChipComponent {
  environment = input.required<ActionEnvironment>();

}
