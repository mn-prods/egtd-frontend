import { Routes } from '@angular/router';
import { ActionsListComponent } from './actions-list/actions-list.component';
import { ActionDetailComponent } from './action-detail/action-detail.component';
import { actionDetailResolver } from './action-detail/action-detail.resolver';
import { URLPARAM_ID_KEY } from 'src/app/common/constants';
import { ActionsPage } from './actions.page';

export const actionItemRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ActionsPage
  },
  {
    path: `:${URLPARAM_ID_KEY}`,
    component: ActionDetailComponent,
    resolve: { action: actionDetailResolver }
  }
];
