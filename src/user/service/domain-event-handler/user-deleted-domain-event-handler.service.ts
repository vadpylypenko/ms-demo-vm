import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import {
  AbstractTypeOrmDomainEventHandler,
  DomainEventEnvelopeEntity,
  DomainEventHandlerInterface,
} from 'domain-event-typeorm';
import { DomainEventHandler } from '../../decorator/domain-event-handler';
import { UserEntity } from '../../entity';
import { UserDeletedEvent } from '../../event/user-deleted.event';
import { TypeOrmTransactionService } from 'transaction-typeorm';

@Injectable()
@DomainEventHandler(UserDeletedEvent)
export class UserDeletedDomainEventHandlerService
  extends AbstractTypeOrmDomainEventHandler<UserDeletedEvent>
  implements DomainEventHandlerInterface
{
  constructor(transactionService: TypeOrmTransactionService) {
    super(transactionService);
  }

  /**
   * @inheritdoc
   */
  protected async handleEvent(
    queryRunner: QueryRunner,
    domainEvent: DomainEventEnvelopeEntity<UserDeletedEvent>,
  ): Promise<void> {
    const { id } = domainEvent.event;

    await queryRunner.manager.delete(UserEntity, { id });
  }
}
