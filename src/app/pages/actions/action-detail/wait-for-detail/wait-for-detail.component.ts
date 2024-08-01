import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
  MatDatepickerIntl,
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { first, firstValueFrom } from 'rxjs';
import { actionTypeIcons } from 'src/app/common/constants';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { RxDoc } from 'src/app/db/db.model';
import { ActionDocument, ActionType } from 'src/app/db/entities/action.entity';
import { GtdPageLayout } from 'src/app/layout/layout.component';
import { ToolbarComponent } from 'src/app/layout/toolbar/toolbar.component';
import { ActionItem } from '../../action-item/action-item.interface';
import { ActionTypeButtonComponent } from '../../action-item/action-type-button/action-type-button.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { assert } from 'src/app/common/functions/assert';
import { isNullOrUndefined } from 'src/app/common/value-check';
import { GoogleCalendarService } from 'src/app/common/services/google-calendar.service';
import { Auth } from '@angular/fire/auth';
import { GoogleCalendarEvents } from 'src/app/common/types/google.type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-wait-for-detail',
  standalone: true,
  templateUrl: './wait-for-detail.component.html',
  styleUrls: ['./wait-for-detail.component.scss'],
  imports: [
    TranslateModule,
    ActionTypeButtonComponent,
    MatFormFieldModule,
    MatInput,
    GtdPageLayout,
    ToolbarComponent,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule
  ]
})
export class WaitForDetailComponent implements ActionItem, OnInit, AfterViewInit {
  @ViewChild(MatCalendar, { static: false }) calendar?: MatCalendar<Date>;

  actionsRepository = inject(ActionsRepository);
  googleCalendar = inject(GoogleCalendarService);
  renderer = inject(Renderer2);
  auth = inject(Auth);
  locale = inject(MAT_DATE_LOCALE) as string;

  action = input.required<RxDoc<ActionDocument>>();

  waitEvents?: RxDoc<ActionDocument>[];
  scheduleEvents?: RxDoc<ActionDocument>[];
  googleEvents?: GoogleCalendarEvents;

  get icon() {
    return actionTypeIcons.wait;
  }

  async ngOnInit() {}

  async ngAfterViewInit() {
    this.waitEvents = await firstValueFrom(
      this.actionsRepository.observeManyByTypeAndProject(ActionType.wait)
    );

    this.scheduleEvents = await firstValueFrom(
      this.actionsRepository.observeManyByTypeAndProject(ActionType.schedule)
    );

    this.googleEvents = await firstValueFrom(
      this.retrieveMonthEvents(this.calendar?.activeDate || new Date())
    );

    /**  this is only used to trigger partial re-rendering and force the dateClass
     * function to be called again
     */
    this.calendar?.updateTodaysDate();
  }

  /**
   * This function is called by the mat-calendar component when it render its cells.
   * Since this function relies on data fetched asynchronously, the mat-calendar must
   * not be drawn until those values are available.
   */
  dateClass: MatCalendarCellClassFunction<Date> = (date: Date): string => {
    let dates: Record<number, number> = {};

    if (this.waitEvents) {
      this.waitEvents
        .map((action) => action.wait?.by)
        .filter((date): date is Date => !!date)
        .reduce((acc, curr) => {
          acc[+curr] = (acc[+curr] || 0) + 1;
          return acc;
        }, dates);
    }

    if (this.scheduleEvents) {
      this.scheduleEvents
        .map((action) => action.schedule?.on)
        .filter((date): date is Date => !!date)
        .reduce((acc, curr) => {
          acc[+curr] = (acc[+curr] || 0) + 1;
          return acc;
        }, dates);
    }

    if (this.googleEvents) {
      this.googleEvents.items
        ?.map((event) => new Date(event.start.dateTime!))
        .filter((date): date is Date => !!date)
        .reduce((acc, curr) => {
          let currentDate = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate());
          acc[+currentDate] = (acc[+currentDate] || 0) + 1;
          return acc;
        }, dates);
    }

    if (!(+date in dates)) {
      return '';
    }

    let query = `[aria-label="${date.toLocaleDateString(this.locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}"]`;

    /**
     * setTimeout here is used to defer the execution of these statements.
     * The statements are trying to fetch the HTMLElement of the date which has been
     * passed to the dateClass function, however the HTMLElement is drawn AFTER this
     * function is called. By using setTimeout without a time argument, we are telling
     * the runtime to queue the execution of these statements at the bottom of the
     * current execution stack.
     */
    setTimeout(() => {
      let element = document.querySelector(query);

      assert(
        !isNullOrUndefined(element),
        `mat-cell corresponging to ${date} not found. Document was queried on ${query}`
      );

      this.renderer.setAttribute(element, 'data-content', `${dates[+date]}`);
    });

    return 'custom-date-class';
  };

  retrieveMonthEvents(date: Date) {
    let month = date.getMonth();
    let year = date.getFullYear();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return this.googleCalendar.getEvents(
      this.auth.currentUser?.email as string,
      startDate,
      endDate
    );
  }

  async setGoogleCalendarEvents(date: Date) {
    this.googleEvents = await firstValueFrom(this.retrieveMonthEvents(date));
    this.calendar?.updateTodaysDate();
  }

  calendarEvent(event: any) {
    console.log(event);
  }

  showContacts() {
    if (!('contacts' in navigator)) return;
    if (!('ContactsManager' in window)) return;

    console.log(navigator.contacts);
  }
}
