import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsStringPipe } from './as.pipe';

@NgModule({
    declarations: [AsStringPipe],
    imports: [ CommonModule ],
    exports: [AsStringPipe],
    providers: [],
})
export class PipesModule {}