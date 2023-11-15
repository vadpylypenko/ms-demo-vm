import {
  AmqpBindingConfigurationAwareInterface,
  AmqpExchangeConfigurationAwareInterface,
  AmqpExchangeConfigurationInterface,
  AmqpQueueConfigurationAwareInterface,
  AmqpQueueConfigurationInterface,
  AmqpBindingConfigurationInterface,
  AbstractAmqpChannelConfiguration,
  ExchangeType,
} from 'amp-configuration';
import { Injectable } from '@nestjs/common';
import { createQueueName } from '../../util/create-queue-name';

@Injectable()
export class UserDomainEventAmqpChannelConfigurationService
  extends AbstractAmqpChannelConfiguration
  implements
    AmqpExchangeConfigurationAwareInterface,
    AmqpBindingConfigurationAwareInterface,
    AmqpQueueConfigurationAwareInterface
{
  getExchangeConfiguration(): AmqpExchangeConfigurationInterface[] {
    return [
      {
        name: 'domain.event',
        type: ExchangeType.TOPIC,
        options: { durable: true },
      },
      // Retry-delay
      {
        name: 'vm.retry',
        type: ExchangeType.TOPIC,
        options: { durable: true },
      },
      {
        name: 'vm.retry.delay',
        type: ExchangeType.TOPIC,
        options: { durable: true },
      },
    ];
  }

  getQueueConfiguration(): AmqpQueueConfigurationInterface[] {
    return [
      {
        name: createQueueName('user.created'),
        options: {
          durable: true,
          arguments: { 'x-dead-letter-exchange': 'vm.retry' },
        },
      },
      {
        name: createQueueName('user.updated'),
        options: {
          durable: true,
          arguments: { 'x-dead-letter-exchange': 'vm.retry' },
        },
      },
      {
        name: createQueueName('user.deleted'),
        options: {
          durable: true,
          arguments: { 'x-dead-letter-exchange': 'vm.retry' },
        },
      },
      // Retry-delay
      {
        name: createQueueName('delay'),
        options: {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': 'vm.retry.delay',
            'x-message-ttl': 10000,
          },
        },
      },
    ];
  }

  getBindingConfiguration(): AmqpBindingConfigurationInterface[] {
    return [
      {
        queue: createQueueName('user.created'),
        exchange: 'domain.event',
        route: 'user.created',
      },
      {
        queue: createQueueName('user.updated'),
        exchange: 'domain.event',
        route: 'user.updated',
      },
      {
        queue: createQueueName('user.deleted'),
        exchange: 'domain.event',
        route: 'user.deleted',
      },
      // Retry-delay
      {
        queue: createQueueName('delay'),
        exchange: 'vm.retry',
        route: 'user.created',
      },
      {
        queue: createQueueName('user.created'),
        exchange: 'vm.retry.delay',
        route: 'user.created',
      },
    ];
  }
}
