import { ObjectValues } from '../common/types/object-values.type';

export const inboxItemStatus = {
  open: 'OPEN',
  closed: 'CLOSED',
  deleted: 'DELETED',
} as const;

export type InboxItemStatus = ObjectValues<typeof inboxItemStatus>;

export interface InboxItem {
  id: string;

  status: InboxItemStatus;

  label: string;

  isClosed: boolean;

  created: Date;

  modified: Date;
}
