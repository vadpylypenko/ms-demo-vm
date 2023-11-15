import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DomainEventEnvelopeEntity,
  HandledDomainEventEntity,
  DomainEventTypeOrmModule,
} from 'domain-event-typeorm';
import { UserEntity } from './user/entity/user.entity';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      entities: [
        UserEntity,
        DomainEventEnvelopeEntity,
        HandledDomainEventEntity,
      ],
      logging: ['query', 'error'],
    }),
    DomainEventTypeOrmModule.forRoot(),
    UserModule,
    CommonModule,
  ],
})
export class AppModule {}
