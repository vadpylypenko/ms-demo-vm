import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { DOMAIN_EVENT_HANDLER } from './constant/domain-event-handler';
import { AmqpServiceToken } from 'domain-event-typeorm';
import { AmqpService } from 'amp-configuration';
import { UserEntity } from './entity';
import { UserService } from './service';
import {
  UserDomainEventAmqpChannelConfigurationService,
  DomainEventHandlerAmqpChannelConfigService,
} from './service/amqp';
import {
  UserCreatedDomainEventHandlerService,
  UserDeletedDomainEventHandlerService,
  UserUpdatedDomainEventHandlerService,
} from './service/domain-event-handler';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), DiscoveryModule],
  providers: [
    UserService,
    DomainEventHandlerAmqpChannelConfigService,
    UserCreatedDomainEventHandlerService,
    UserUpdatedDomainEventHandlerService,
    UserDeletedDomainEventHandlerService,
    UserDomainEventAmqpChannelConfigurationService,
  ],
})
export class UserModule implements OnApplicationBootstrap {
  constructor(
    private readonly discovery: DiscoveryService,
    @Inject(AmqpServiceToken)
    private readonly amqp: AmqpService,
    private readonly amqpConfig: DomainEventHandlerAmqpChannelConfigService,
    private readonly userAmqpConfig: UserDomainEventAmqpChannelConfigurationService,
  ) {}

  onApplicationBootstrap() {
    const wrappers = this.discovery.getProviders();

    wrappers.forEach((wrapper) => {
      if (wrapper.metatype) {
        const event = Reflect.getMetadata(
          DOMAIN_EVENT_HANDLER,
          wrapper.metatype,
        );

        if (event) {
          this.amqpConfig.addDomainEventHandler(event, wrapper.instance);
        }
      }
    });

    this.amqp.addChannelConfig(this.userAmqpConfig);
    this.amqp.addChannelConfig(this.amqpConfig);

    this.amqp.connect();
  }
}
