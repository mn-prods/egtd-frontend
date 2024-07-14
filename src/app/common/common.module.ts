import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, TranslateModule, PipesModule, ReactiveFormsModule],
  exports: [TranslateModule, ReactiveFormsModule, PipesModule]
})
export class AppCommonModule {}
