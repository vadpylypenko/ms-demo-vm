import { DomainEventInterface } from 'domain-event-typeorm';
import { UserEntity } from '../entity/user.entity';

export class UserCreatedEvent implements DomainEventInterface {
  constructor(readonly user: UserEntity) {}
}
