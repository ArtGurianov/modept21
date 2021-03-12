import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { ContractRepository } from './contract.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractRepository,
    ]),
  ],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
