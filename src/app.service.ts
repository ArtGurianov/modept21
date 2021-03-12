import {
  Injectable,
  InternalServerErrorException,
  OnApplicationShutdown,
  Logger
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Agency } from './agency/agency.entity';
import { AgencyRepository } from './agency/agency.repository';
import { Booker2Agency } from './agency/booker2agency.entity';
import { Booker2AgencyRepository } from './agency/booker2agency.repository';
import { ModelingContract } from './contract/contract.entity';
import { ModelingContractRepository } from './contract/modelingContract.repository';
import { MotherContract } from './contract/motherContract.entity';
import { MotherContractRepository } from './contract/contract.repository';
import { AdminRoles } from './types/adminRoles.enum';
import { BookerRoles } from './types/bookerRoles.enum';
import { UserTypes } from './types/userTypes.enum';
import { Admin } from './user/admin/admin.entity';
import { AdminRepository } from './user/admin/admin.repository';
import { Booker } from './user/booker/booker.entity';
import { BookerRepository } from './user/booker/booker.repository';
import { Model } from './user/model/model.entity';
import { ModelRepository } from './user/model/model.repository';
import { User } from './user/user.entity';
import { UserRepository } from './user/user.repository';
import { fakeAdminIdMap, fakeB2AIdMap, fakeBookerIdMap } from './utils/maps/fakeAuthIdMap';
import { fakeAgencyId1, fakeAgencyId2, fakeBasicAdminId, fakeBasicBookerId, fakeHeadBookerId, fakeModelId, fakeModeratorAdminId, fakeMotherContractId, fakeModelingContractId, fakeSuperAdminId } from './utils/fakeIds';

@Injectable()
export class AppService implements OnApplicationShutdown {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectRepository(Admin)
    private readonly adminRepo: AdminRepository,
    @InjectRepository(Agency)
    private readonly agencyRepo: AgencyRepository,
    @InjectRepository(Booker)
    private readonly bookerRepo: BookerRepository,
    @InjectRepository(Booker2Agency)
    private readonly b2aRepo: Booker2AgencyRepository,
    @InjectRepository(Model)
    private readonly modelRepo: ModelRepository,
    @InjectRepository(ModelingContract)
    private readonly modelingContractRepo: ModelingContractRepository,
    @InjectRepository(MotherContract)
    private readonly motherContractRepo: MotherContractRepository,
    @InjectRepository(User)
    private readonly userRepo: UserRepository,
  ) {
  }


  async onApplicationShutdown(signal: string): Promise<void> {
    await this.connection.close();
    this.logger.log(`Terminated by: ${signal}`);
  }

  getHello(): string {
    return `Welcome to <i><b>voicy.ru</b></i> <s>graphql</s> REST api. You can play with it by sending get/post requests! Have fun :)`;
  }

  async injectFakeEntities(): Promise<boolean> {
    const alreadyExists = await this.adminRepo.findOne({id: fakeSuperAdminId});
    if (alreadyExists) {
      return false;
    }


    //FAKE ADMINS

    await Promise.all((Object.keys(fakeAdminIdMap) as AdminRoles[]).map(async adminRole => {
      const userAdminEntity = await this.userRepo.save({
        id: fakeAdminIdMap[adminRole],
        userType: UserTypes.ADMIN,
      })
      if (!userAdminEntity) {
        throw new InternalServerErrorException('could not save entity');
      }

      const adminEntity = await this.adminRepo.save({id: fakeAdminIdMap[adminRole], user: userAdminEntity, adminRole });
      if (!adminEntity) {
        throw new InternalServerErrorException('could not save entity');
      }

      return;
    })); 

    // FAKE BOOKERS AND B2A

    await Promise.all((Object.keys(fakeBookerIdMap) as BookerRoles[]).map(async bookerRole => {
      const fakeBookerUserEntity = await this.userRepo.save({
        id: fakeBookerIdMap[bookerRole],
        userType: UserTypes.BOOKER,
      })
      if (!fakeBookerUserEntity) {
        throw new InternalServerErrorException('could not save entity');
      }

      const fakeBookerEntity = await this.bookerRepo.save({id: fakeBookerIdMap[bookerRole], user: fakeBookerUserEntity});
      if (!fakeBookerEntity) {
        throw new InternalServerErrorException('could not save entity');
      }

      const fakeB2AEntity = await this.b2aRepo.save({id: fakeB2AIdMap[bookerRole], bookerId: fakeBookerUserEntity.id, agencyId: fakeAgencyId1, bookerRole});
      if (!fakeB2AEntity) {
        throw new InternalServerErrorException('could not save entity');
      }

      return;
    })); 

    // FAKE AGENCIES
    const fakeAgencyEntity1 = await this.agencyRepo.save({id: fakeAgencyId1, creatorId: fakeHeadBookerId, reviewerId: fakeBasicAdminId});
    if (!fakeAgencyEntity1) {
      throw new InternalServerErrorException('could not save entity');
    }
    const fakeAgencyEntity2 = await this.agencyRepo.save({id: fakeAgencyId2, creatorId: fakeBasicBookerId, reviewerId: fakeModeratorAdminId});
    if (!fakeAgencyEntity2) {
      throw new InternalServerErrorException('could not save entity');
    }

    // FAKE MODELS
    const fakeModelEntity = await this.modelRepo.save({id: fakeModelId});
    if (!fakeModelEntity) {
      throw new InternalServerErrorException('could not save entity');
    }

    // FAKE CONTRACTS
    const fakeMotherContract = await this.motherContractRepo.save({id: fakeMotherContractId, modelId: fakeModelId, motherAgencyId: fakeAgencyId1});
    if (!fakeMotherContract) {
      throw new InternalServerErrorException('could not save entity');
    }
    const fakeModelingContract = await this.modelingContractRepo.save({id: fakeModelingContractId, modelId: fakeModelId, motherAgencyId: fakeAgencyId1, modelingAgencyId: fakeAgencyId2});
    if (!fakeModelingContract) {
      throw new InternalServerErrorException('could not save entity');
    }

    return true;
  }
}
