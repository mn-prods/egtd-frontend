import { Route } from "@angular/router";
import { InboxPage } from "./inbox.page";
import { InboxActionChoiceComponent } from "./inbox-action-choice/inbox-action-choice.component";
import { inboxActionChoiceResolver } from "./inbox-action-choice/inbox-action-choice.resolver";

export const inboxRoutes: Route[] = [
    { path: '', component: InboxPage, pathMatch: 'full' },
    { path: ':id', component: InboxActionChoiceComponent, resolve: { item: inboxActionChoiceResolver } }
]