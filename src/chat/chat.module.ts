import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [AuthModule, MessagesModule],
})
export class ChatModule {}
