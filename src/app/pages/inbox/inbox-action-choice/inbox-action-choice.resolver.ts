import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { URLPARAM_ID_KEY } from 'src/app/common/constants';
import { InboxDocument } from 'src/app/db/entities/inbox.entity';
import { InboxRepository } from 'src/app/db/inbox.repository';

export const inboxActionChoiceResolver: ResolveFn<InboxDocument> = (route, state) => {
  const inboxRepository = inject(InboxRepository)

  const itemId = route.paramMap.get(URLPARAM_ID_KEY)

  if (!itemId) {
    alert("The route is missing the item id, this is a bug and is not supposed to happen")
    throw new Error("The route is missing the item id, this is a bug and is not supposed to happen")
  }

  return inboxRepository.getOneById(itemId);
};
