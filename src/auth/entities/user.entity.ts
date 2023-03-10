
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
    required: true,
  })
  email: string;

  @Prop({
    required: true,
    // select: false,
  })
  password: string;
  
  @Prop({
    default: false
  })
  online: boolean;

  @Prop({
    default: null,
  })
  image: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
