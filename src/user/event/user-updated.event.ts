import { DomainEventInterface } from 'domain-event-typeorm';
import { UserEntity } from '../entity/user.entity';

export class UserUpdatedEvent implements DomainEventInterface {
  constructor(readonly user: UserEntity) {}
}
