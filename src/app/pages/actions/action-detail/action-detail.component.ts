import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActionDocument, ActionType } from 'src/app/db/entities/action.entity';
import { NavigationService } from 'src/app/navigation.service';
import { WaitForDetailComponent } from './wait-for-detail/wait-for-detail.component';
import { RxDoc } from 'src/app/db/db.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-detail',
  standalone: true,
  imports: [CommonModule, WaitForDetailComponent],
  templateUrl: './action-detail.component.html',
  styleUrl: './action-detail.component.scss'
})
export class ActionDetailComponent implements AfterViewInit {
  @ViewChild('wait', { static: false }) wait!: TemplateRef<WaitForDetailComponent>;

  templates!: Record<ActionType, TemplateRef<any>> 

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
      do: this.wait,
      schedule: this.wait
    };
  }
}
