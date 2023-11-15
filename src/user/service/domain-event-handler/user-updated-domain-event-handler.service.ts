import { Injectable } from '@nestjs/common';
import { LessThan, QueryRunner } from 'typeorm';
import { plainToClass } from 'class-transformer';
import {
  AbstractTypeOrmDomainEventHandler,
  DomainEventEnvelopeEntity,
  DomainEventHandlerInterface,
} from 'domain-event-typeorm';
import { DomainEventHandler } from '../../decorator/domain-event-handler';
import { UserEntity } from '../../entity';
import { UserUpdatedEvent } from '../../event/user-updated.event';
import { TypeOrmTransactionService } from 'transaction-typeorm';

@Injectable()
@DomainEventHandler(UserUpdatedEvent)
export class UserUpdatedDomainEventHandlerService
  extends AbstractTypeOrmDomainEventHandler<UserUpdatedEvent>
  implements DomainEventHandlerInterface
{
  constructor(transactionService: TypeOrmTransactionService) {
    super(transactionService);
  }

  protected async handleEvent(
    queryRunner: QueryRunner,
    domainEvent: DomainEventEnvelopeEntity<UserUpdatedEvent>,
  ): Promise<void> {
    const user = plainToClass(UserEntity, domainEvent.event.user);

    const qb = queryRunner.manager.createQueryBuilder();

    await qb
      .update(UserEntity, user)
      .where({ version: LessThan(user.version) })
      .andWhere({ id: user.id })
      .execute();
  }
}
