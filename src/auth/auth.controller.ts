import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { UserDocument } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginUserDto){
    return this.authService.login(loginDto);
  }

  @Get('renew')
  @Auth()
  renew( @GetUser() user:UserDocument){
    return this.authService.renewToken(user);
  }

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  @Get('users')
  @Auth()
  findAll( @GetUser() user: UserDocument, @Query() paginationDto: PaginationDto ) {
    return this.authService.findAll(user, paginationDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
