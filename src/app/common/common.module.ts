import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoiceModalComponent } from './components/choice-modal/choice-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ChoiceModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    ScrollingModule,
    ReactiveFormsModule,
  ],
  exports: [TranslateModule, ScrollingModule, ReactiveFormsModule],
})
export class AppCommonModule {}
