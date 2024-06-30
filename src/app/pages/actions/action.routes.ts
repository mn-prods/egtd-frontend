import { Routes } from "@angular/router";
import { NextActionsComponent } from "./next-actions.component";
import { ActionDetailComponent } from "./action-detail/action-detail.component";
import { actionDetailResolver } from "./action-detail/action-detail.resolver";
import { URLPARAM_ID_KEY } from "src/app/common/constants";

export const actionRoutes: Routes = [{
    path: '',
    pathMatch: 'full',
    component: NextActionsComponent, // placeholder
},
{
    path: `:${URLPARAM_ID_KEY}`,
    component: ActionDetailComponent,
    resolve: { action: actionDetailResolver }
}]