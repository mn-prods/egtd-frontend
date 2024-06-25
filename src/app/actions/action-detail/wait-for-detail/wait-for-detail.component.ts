import { Component, input } from '@angular/core';
import { ActionTypeButtonComponent } from '../../action-item/action-type-button/action-type-button.component';
import { ActionDocument } from 'src/app/db/entities/action.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-wait-for-detail',
  standalone: true,
  templateUrl: './wait-for-detail.component.html',
  styleUrls: ['./wait-for-detail.component.scss'],
  imports: [ActionTypeButtonComponent, MatFormFieldModule, MatInput]
})
export class WaitForDetailComponent {
    action = input.required<ActionDocument>();

}
