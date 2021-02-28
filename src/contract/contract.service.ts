import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewModelInvitationDto } from '../user/model/dto/newModelInvitation.dto';
import { ContractRepository } from './modelingContract.repository';

@Injectable()
export class ContractService {
  public constructor(
    @InjectRepository(ContractRepository)
    private readonly contractRepo: ContractRepository,
    @InjectRepository(ModelRepository)
    private readonly modelRepo: ModelRepository,
    private readonly emailService: EmailService,
  ) {}


  //AGENCY| createNewModelInvitation()
  // - checkRegisteredModel() - check that model is not yet registered.
  // - uploadContract() - upload paper pdf signed contract. 
  // - specify contract details (new contract entity).
  // - send email.
  //MODEL| registerModel
  // - invitation code redis check.
  // - manually check contract pdf and details. confirm or reject.
  // - confirm and create new model entity.
  // - OR reject with comment. Wait for next invitation.
  async sendNewModelInvitation({email, signedPdfLink}: NewModelInvitationDto): Promise<boolean> {
    //1. Check if model email already exist in platform.
    const alreadyExist = await this.modelRepo.findOne({ where: { email } });
    //2. If not, send invitation email. 
    if (!alreadyExist) {
      const emailSent = await this.emailService.sendNewModelInvitationEmail(email);
      //Once confirmed, create new Model entity and new signed MotherContract (warn to confirm ONLY IF already signed with this agency. Also ask if model already registered. If so, then please use old email or change email of the account to same as provided in this invitation).
      return true
    }
    //2.1 If yes, check if there is current MA signed.
    //2.2.1 If yes, reject offer until conflict resolved.
    //2.2.2 If not, create new MotherContract and send email and also push notification.
  }
}
