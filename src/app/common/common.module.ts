import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoiceModalComponent } from './components/choice-modal/choice-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [ChoiceModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    ScrollingModule,
    PipesModule,
    ReactiveFormsModule,
  ],
  exports: [TranslateModule, ScrollingModule, ReactiveFormsModule, PipesModule],
})
export class AppCommonModule {}
