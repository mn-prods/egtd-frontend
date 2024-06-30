import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { URLPARAM_ID_KEY } from 'src/app/common/constants';
import { RxDoc } from 'src/app/db/db.model';
import { ProjectDocument } from 'src/app/db/entities/project.entity';
import { ProjectsRepository } from 'src/app/db/project.repository';

export const projectDetailResolver: ResolveFn<RxDoc<ProjectDocument>> = (route, state) => {
  const projectsRepository = inject(ProjectsRepository);

  const itemId = route.paramMap.get(URLPARAM_ID_KEY);

  if (!itemId) {
    alert('The route is missing the item id, this is a bug and is not supposed to happen');
    throw new Error(
      'The route is missing the item id, this is a bug and is not supposed to happen'
    );
  }

  return projectsRepository.getOneById(itemId);
};
