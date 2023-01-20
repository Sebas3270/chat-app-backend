import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res, Req, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage, memoryStorage } from 'multer';
import { AuthService } from 'src/auth/auth.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { UserDocument } from 'src/auth/entities/user.entity';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    
  ) {}

  @Get('user/:imageName')
  findUserImage( @Param('imageName') imageName: string, @Res() res:Response){
    const path = this.filesService.getStaticUserImage(imageName);
    return res.sendFile(path)
  }

  @Auth()
  @Post('user')
  @UseInterceptors( FileInterceptor('file', {
        fileFilter: fileFilter,
        storage: memoryStorage(),
      }
    )
  )
  async uploadUserImage( @UploadedFile() file: Express.Multer.File, @GetUser() user: UserDocument ){
    return await this.filesService.updateImageProfile(file, user);
  }

  @Auth()
  @Delete('user')
  async deleteUserImage(  @GetUser() user: UserDocument ){
    return await this.filesService.deleteImageProfile(user);
  }
}
