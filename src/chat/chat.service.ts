import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class ChatService {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,  
        private readonly messagesService: MessagesService,
    ){}

    verifyClient(token: string){
        let payload: JwtPayload;
        try {
            payload = this.jwtService.verify(token);
            return payload.id;
        } catch (error) {
            return undefined;
        }
    }

    async onlineClient(id:string){
        const user = await this.userModel.findById(id);
        user.online = true;
        await user.save();
        return user;
    }

    async offlineClient(id:string){
        const user = await this.userModel.findById(id);
        user.online = false;
        await user.save();
        return user;
    }

    async saveMessage(payload: CreateMessageDto){
        const message = await this.messagesService.create(payload);
        return message;
    }

}
