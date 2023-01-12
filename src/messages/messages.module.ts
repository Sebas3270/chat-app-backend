import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      }
    ]),
    AuthModule
  ],
  exports: [MessagesService]
})
export class MessagesModule {}
