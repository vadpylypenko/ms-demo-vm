import { DomainEventInterface } from 'domain-event-typeorm';

export class UserDeletedEvent implements DomainEventInterface {
  constructor(readonly id: string) {}
}
