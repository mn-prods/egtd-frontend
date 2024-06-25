import { Routes } from "@angular/router";
import { NextActionsComponent } from "./next-actions.component";
import { ActionDetailComponent } from "./action-detail/action-detail.component";
import { actionDetailResolver } from "./action-detail/action-detail.resolver";

export const actionRoutes: Routes = [{
    path: '',
    pathMatch: 'full',
    component: NextActionsComponent, // placeholder
},
{
    path: ':id',
    component: ActionDetailComponent,
    resolve: { action: actionDetailResolver }
}]