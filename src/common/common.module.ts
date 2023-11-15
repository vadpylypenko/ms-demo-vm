import { Global, Module } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { TypeOrmTransactionService } from 'mutation-typeorm';

@Global()
@Module({
  providers: [
    {
      provide: TypeOrmTransactionService,
      useFactory: (dataSource) => new TypeOrmTransactionService(dataSource),
      inject: [getDataSourceToken()],
    },
  ],
  exports: [TypeOrmTransactionService],
})
export class CommonModule {}
