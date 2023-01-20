import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { chatType } from './interfaces/message-type.interface';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss : Server;
  private userId: string;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,  
  ) {}

  handleConnection(client: Socket, ...args: any[]) {

    const token = client.handshake.headers.authentication as string;
    this.userId = this.chatService.verifyClient(token);

    if(!this.userId) return client.disconnect();

    this.chatService.onlineClient(this.userId);

    client.join( this.userId );

    console.log('Connected client: ', client.id);
  }

  handleDisconnect(client: Socket) {
    this.chatService.offlineClient(this.userId);
    console.log('Disconnected client: ', client.id);
  }

  @SubscribeMessage(chatType.privateMessage)
  async handlePrivateMessage(client: Socket, payload: CreateMessageDto){
    await this.chatService.saveMessage(payload);
    this.wss.to(payload.to).emit(chatType.privateMessage, payload);
  }

}
