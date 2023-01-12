import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User, UserDocument } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('SECRET_TOKEN'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload:JwtPayload):Promise<UserDocument> {

        const { id: uid } = payload;

        const user = await this.userModel.findById(uid);
        if(!user) throw new UnauthorizedException('Token not valid');

        return user;

    }

}