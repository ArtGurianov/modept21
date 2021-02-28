import * as bcrypt from 'bcryptjs';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from '../user/user.entity';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    //TODO: check if there is a password.
    //!!! NOT ALLOW to login with default password !!!
    event.entity.password = await bcrypt.hash(event.entity.password, 12);
  }
}
