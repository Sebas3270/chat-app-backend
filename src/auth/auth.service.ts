import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ){}

  async createUser(createUserDto: CreateUserDto){
    try {

      createUserDto.name = createUserDto.name.trim();
      createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);

      const user = await this.userModel.create(createUserDto);
      
      return user;
      
    } catch (error) {
      return this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto){

    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email });
    console.log(user)

    if(!user)
      throw new NotFoundException('User not found, check your credentials')

    if(!bcrypt.compareSync(password, user.password))
      throw new NotFoundException('User not found, check your credentials')

    return {
      user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  renewToken(user: UserDocument){
    return {
      user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDbErrors(error: any){

    // const errorRes = {message: []};

    if(error.code === 11000){
      // errorRes.message.push('Email is already registered');
      // return errorRes;
      throw new BadRequestException(['Email is already registered']);
    }

    throw new NotImplementedException(['Unhandled error, call administrator'])
    
  }
}
