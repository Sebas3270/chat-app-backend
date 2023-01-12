
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
  })
  from: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
  })
  to: Types.ObjectId;

  @Prop({
    required: true,
  })
  message: string;

  @Prop({
    default: Date.now
  })
  createdAt: Date

  @Prop({
    default: Date.now
  })
  updatedAt: Date
  
}

export const MessageSchema = SchemaFactory.createForClass(Message);