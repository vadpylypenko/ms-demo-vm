import { Injectable } from '@nestjs/common';
import { AbstractAmqpChannelConfiguration } from 'amp-configuration';
import { ConfirmChannel, ConsumeMessage, Channel } from 'amqplib';
import { DomainEventInterface } from 'domain-event-typeorm';
import { createQueueName } from '../../util/create-queue-name';

@Injectable()
export class DomainEventHandlerAmqpChannelConfigService extends AbstractAmqpChannelConfiguration {
  private readonly domainEventHandlers = new Map();

  addDomainEventHandler(queueName: string, handler: any) {
    this.domainEventHandlers.set(queueName, handler);
  }

  /**
   * @inheritdoc
   */
  async configure(channel: ConfirmChannel): Promise<void> {
    await super.configure(channel);

    this.domainEventHandlers.forEach((handler, event) => {
      /**
       * @todo: move to utils of the domain event.
       */
      const queueName = event
        .replace('Event', '')
        .split(/\.?(?=[A-Z])/)
        .join('.')
        .toLowerCase();

      channel.consume(
        createQueueName(queueName),
        (msg: ConsumeMessage | null) => this.consume(channel, msg, handler),
      );
    });
  }

  async consume(
    channel: Channel,
    msg: ConsumeMessage | null,
    handler,
  ): Promise<void> {
    if (msg) {
      try {
        const event: DomainEventInterface = JSON.parse(msg.content.toString());

        await handler.handle(event);

        channel.ack(msg);
      } catch (error) {
        channel.nack(msg, false, false);

        console.log(error);
      }
    }
  }
}
