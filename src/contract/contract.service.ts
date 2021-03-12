import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewModelInvitationDto } from '../agency/dto/newModelInvitationDto';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';
import { ContractTypes } from '../types/contractTypes.enum';
import { REDIS_PREFIXES } from '../types/redisPrefixes.enum';
import { ModelRepository } from '../user/model/model.repository';
import { isPeriodBooked } from '../utils/isPeriodBooked';
import otpGen from '../utils/otpGen';
import { ContractRepository } from './contract.repository';
import { ContractConditionsRepository } from './contractConditions.repository';
import { ContractConditionsDto } from './dto/contractConditions.dto';

@Injectable()
export class ContractService {
  public constructor(
    @InjectRepository(ContractRepository)
    private readonly contractRepo: ContractRepository,
    @InjectRepository(ContractConditionsRepository)
    private readonly conditionsRepo: ContractConditionsRepository,
    @InjectRepository(ModelRepository)
    private readonly modelRepo: ModelRepository,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

  async checkModelAvailability(email: string, contractType: ContractTypes, periodFrom: Date, periodTill: Date): Promise<{ isAvailable: boolean, modelId: string | null, conflictedContractId: string | null}> {
    const model = await this.modelRepo.findOne({ where: { email } });
    if (!model) {
      return { isAvailable: true, modelId: null, conflictedContractId: null };
    }
    const modelContracts = await this.contractRepo.find({where: {modelId: model.id, contractType}, relations: ['conditions']});
    const conflictedContract = modelContracts.find(contract => {
      return isPeriodBooked(periodFrom, periodTill, contract.conditions.periodFrom, contract.conditions.periodTill);
    });
    if (conflictedContract) {
      return { isAvailable: false, modelId: model.userId, conflictedContractId: conflictedContract.id };
    }
    return { isAvailable: true, modelId: model.userId, conflictedContractId: null};
  };

  async newContractConditionsObject(contractConditionsDto: ContractConditionsDto): Promise<string> {
    const saved = await this.conditionsRepo.save(contractConditionsDto);
    if (!saved) {
      throw new InternalServerErrorException('could not save Contract Conditions object.');
    }
    return saved.id;
  };

  async inviteNewSignedModel(newModelInvitationDto: NewModelInvitationDto): Promise<boolean> {
    const {email} = newModelInvitationDto;
    const alreadyExists = await this.modelRepo.findOne({ where: { email } });
    if (alreadyExists) {
      throw new ConflictException('model already exists in the platform!');
    }
    const otp = otpGen();
    const alreadyInvited = await this.redisService.get(`${REDIS_PREFIXES.INVITATION_OTP}${otp}`);
    if (alreadyInvited) {
      throw new ConflictException('you already invited this model!');
    }
    const invitation = await this.redisService.set(`${REDIS_PREFIXES.INVITATION_OTP}${otp}`, `${newModelInvitationDto}`);
    if (!invitation) {
      throw new InternalServerErrorException('could not create invitation');
    }

    const sent = await this.emailService.pushToEmailQueue(new ModelInvitationEmailData(email, otp));
    if ( !sent ) {
      throw new InternalServerErrorException('could not send invitation email');
    }
    
    return true;
  };

  async viewInvitationDetails() {

  }

  async completeModelRegister() {
    //create model account?
    //create contract entity?
  };

  async createNewContractOffer(modelId: string, conditionsId: string, agencyId: string, bookerId: string, contractType: ContractTypes) {
    
  };


  //AGENCY| inviteNewSignedModel()
  // - checkRegisteredModel() - check that model is not yet registered.
  // - BEFORE uploadContract() - upload paper pdf signed contract. 
  // - specify contract details (new contract entity).
  // - send email.
  //MODEL| registerModel
  // - invitation code redis check.
  // - manually check contract pdf and details. confirm or reject.
  // - confirm and create new model entity.
  // - OR reject with comment. Wait for next invitation.
}
