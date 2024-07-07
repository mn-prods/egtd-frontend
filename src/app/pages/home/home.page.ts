import { Component } from '@angular/core';
import { GtdPageLayout } from 'src/app/layout/layout.component';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ToolbarComponent, GtdPageLayout]
})
export class HomePage {}
