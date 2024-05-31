import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsStringPipe } from './as-string.pipe';
import { FilterPipe } from './filter.pipe';

@NgModule({
    declarations: [AsStringPipe, FilterPipe],
    imports: [CommonModule],
    exports: [AsStringPipe, FilterPipe],
    providers: [],
})
export class PipesModule { }