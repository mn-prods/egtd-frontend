import { Component } from '@angular/core';
// import { ModalController } from '@ionic/angular';

export interface Choice {
  value: boolean | number | string;
  role: string;
}

@Component({
  selector: 'app-choice-modal',
  templateUrl: './choice-modal.component.html',
  styleUrls: ['./choice-modal.component.scss'],
})
export class ChoiceModalComponent {
  message!: string;

  choices: Choice[] = [
    { value: false, role: 'cancel' },
    { value: true, role: 'confirm' },
  ];

  // constructor(private modal: ModalController) {}
  
  close(i: number) {
    const { value, role } = this.choices[i];
    // this.modal.dismiss(value, role);
  }
}
