import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { URLPARAM_ID_KEY } from 'src/app/common/constants';
import { ActionsRepository } from 'src/app/db/actions.repository';
import { RxDoc } from 'src/app/db/db.model';
import { ActionDocument } from 'src/app/db/entities/action.entity';

export const actionDetailResolver: ResolveFn<RxDoc<ActionDocument>> = (route, state) => {
  const actionRepository = inject(ActionsRepository);

  const itemId = route.paramMap.get(URLPARAM_ID_KEY);

  if (!itemId) {
    alert('The route is missing the item id, this is a bug and is not supposed to happen');
    throw new Error(
      'The route is missing the item id, this is a bug and is not supposed to happen'
    );
  }

  return actionRepository.getOneById(itemId);
};
