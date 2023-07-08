import { User } from '../common/interfaces/user.interface';

export enum InboxItemStatus {
  open = 'OPEN',
  closed = 'CLOSED',
  deleted = 'DELETED',
}

export interface InboxItem {
  id: string;

  status: InboxItemStatus;

  label: string;

  isClosed: boolean;

  created: Date;

  modified: Date;
}
