import { Route } from '@angular/router';
import { InboxPage } from './inbox.page';
import { InboxActionChoiceComponent } from './inbox-action-choice/inbox-action-choice.component';
import { inboxActionChoiceResolver } from './inbox-action-choice/inbox-action-choice.resolver';
import { URLPARAM_ID_KEY } from 'src/app/common/constants';

export const inboxRoutes: Route[] = [
  { path: '', component: InboxPage, pathMatch: 'full' },
  {
    path: `:${URLPARAM_ID_KEY}`,
    component: InboxActionChoiceComponent,
    resolve: { item: inboxActionChoiceResolver }
  }
];
