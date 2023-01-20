import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { UserDocument } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ){}

  async create(createMessageDto: CreateMessageDto) {
    const message = await this.messageModel.create(createMessageDto);
    return message;
  }

  findAll() {
    return `This action returns all messages`;
  }

  async findAllById(fromId: Types.ObjectId, user: UserDocument, paginationDto: PaginationDto) {

    const myId = user.id;

    const {limit = 30, offset = 0} = paginationDto;

      const messages = await this.messageModel.find({
        $or: [{from: myId, to: fromId}, {from: fromId, to: myId}]
      })
        .sort({ createdAt: 'desc' })
        .limit(limit)
        .skip(offset);

    return messages;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
