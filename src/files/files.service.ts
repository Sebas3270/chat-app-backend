import { Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { dirname, join } from 'path';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import { ConfigService } from '@nestjs/config';
import toStream from 'buffer-to-stream';
import * as streamifier from 'streamifier';
import { Readable } from 'stream';
import { AuthService } from 'src/auth/auth.service';
import { UserDocument } from 'src/auth/entities/user.entity';

@Injectable()
export class FilesService {

  private cloudinaryProp = cloudinary;

  constructor(
    private readonly configService: ConfigService,
    private readonly authSrvice: AuthService
  ) {
    this.cloudinaryProp.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    })
  }

  getStaticUserImage(imageName: string) {

    const path = join(__dirname, '../../static/pictures', imageName);

    if (!existsSync(path)) throw new NotFoundException(`No user image found with '${imageName}'`);

    return path;

  }

  async updateImageProfile(file: Express.Multer.File, user: UserDocument){
    try {

      if ( user.image ){ 
        const image = this.getImageName(user.image);
        await cloudinary.uploader.destroy(`chat_app/${image}`, {type : 'upload', resource_type : 'image', }, result => {
          console.log(result);
          return result;
        });
      }

      const { secure_url } = await this.uploadImageToServer(file.buffer);
      await this.authSrvice.update({ image: secure_url }, user);
      const newUser = this.authSrvice.findOne(user.id);

      return newUser;
      
    } catch (error) {
      console.log('error: ',error);
    }
  }

  async deleteImageProfile(user: UserDocument){
    try {

      if ( !user.image ){ 

        return user;

      }

      const image = this.getImageName(user.image);
      await cloudinary.uploader.destroy(`chat_app/${image}`, {type : 'upload', resource_type : 'image', }, result => {
        console.log(result);
        return result;
      });
      
      await this.authSrvice.update({ image: null }, user);
      const newUser = this.authSrvice.findOne(user.id);

      return newUser;
      
    } catch (error) {
      console.log('error: ',error);
    }
  }

  private async uploadImageToServer(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'chat_app',
        },
        (error: Error, result: UploadApiResponse) => {
          if (result) resolve(result);
          else reject(error);
        },
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  private getImageName( image: string ){
    const parts = image.split('/');
    const imageWithExtension = parts.at(-1);
    const imageName = imageWithExtension.split('.')[0];
    return imageName;
  }


}
