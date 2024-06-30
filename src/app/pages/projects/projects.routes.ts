import { Routes } from '@angular/router';
import { ProjectsPage } from './projects.page';
import { ProjectDetailsPage } from './project-details/project-details.page';
import { projectDetailResolver } from './project.resolver';
import { URLPARAM_ID_KEY } from 'src/app/common/constants';

export const projectsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ProjectsPage // placeholder
  },
  {
    path: `:${URLPARAM_ID_KEY}`,
    component: ProjectDetailsPage,
    resolve: { project: projectDetailResolver }
  }
];
