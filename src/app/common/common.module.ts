import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoiceModalComponent } from './components/choice-modal/choice-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [ChoiceModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PipesModule,
    ReactiveFormsModule,
  ],
  exports: [TranslateModule, ReactiveFormsModule, PipesModule],
})
export class AppCommonModule {}
