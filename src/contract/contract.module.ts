import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { ModelingContractRepository } from './modelingContract.repository';
import { MotherContractRepository } from './motherContract.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      MotherContractRepository,
      ModelingContractRepository,
    ]),
  ],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
