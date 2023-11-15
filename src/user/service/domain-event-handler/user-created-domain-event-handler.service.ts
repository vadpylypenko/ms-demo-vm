import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { plainToClass } from 'class-transformer';
import {
  AbstractTypeOrmDomainEventHandler,
  DomainEventEnvelopeEntity,
  DomainEventHandlerInterface,
} from 'domain-event-typeorm';
import { DomainEventHandler } from '../../decorator/domain-event-handler';
import { UserCreatedEvent } from '../../event/user-created.event';
import { UserEntity } from '../../entity';
import { TypeOrmTransactionService } from 'transaction-typeorm';

@Injectable()
@DomainEventHandler(UserCreatedEvent)
export class UserCreatedDomainEventHandlerService
  extends AbstractTypeOrmDomainEventHandler<UserCreatedEvent>
  implements DomainEventHandlerInterface
{
  constructor(transactionService: TypeOrmTransactionService) {
    super(transactionService);
  }

  protected async handleEvent(
    queryRunner: QueryRunner,
    domainEvent: DomainEventEnvelopeEntity<UserCreatedEvent>,
  ): Promise<void> {
    const user = plainToClass(UserEntity, domainEvent.event.user);

    await queryRunner.manager.save(user);
  }
}
