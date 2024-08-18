import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RxDoc } from 'src/app/db/db.model';
import { ActionDocument, ActionType } from 'src/app/db/entities/action.entity';
import { NavigationService } from 'src/app/navigation.service';
import { ScheduleDetailComponent } from './schedule-detail/schedule-detail.component';
import { WaitForDetailComponent } from './wait-for-detail/wait-for-detail.component';
import { NextActionDetailComponent } from './next-action-detail/next-action-detail.component';

@Component({
  selector: 'app-action-detail',
  standalone: true,
  imports: [
    CommonModule,
    WaitForDetailComponent,
    ScheduleDetailComponent,
    NextActionDetailComponent
  ],
  templateUrl: './action-detail.component.html',
  styleUrl: './action-detail.component.scss'
})
export class ActionDetailComponent implements AfterViewInit {
  @ViewChild('wait', { static: false }) wait!: TemplateRef<WaitForDetailComponent>;
  @ViewChild('schedule', { static: false }) schedule!: TemplateRef<ScheduleDetailComponent>;
  @ViewChild('do', { static: false }) nextAction!: TemplateRef<NextActionDetailComponent>;

  templates!: Record<ActionType, TemplateRef<any>>;

  navigation = inject(NavigationService);
  route = inject(ActivatedRoute);

  action = signal<RxDoc<ActionDocument> | null>(null);

  actionBody!: FormControl<string | null>;
  actionTypes = ActionType;

  ngAfterViewInit(): void {
    this.action.set(this.route.snapshot.data['action']);

    this.actionBody = new FormControl<string>(this.action()!.body);

    this.templates = {
      wait: this.wait,
      do: this.nextAction,
      schedule: this.schedule
    };
  }
}
