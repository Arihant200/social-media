import { Controller, Get, Patch, Param, Body, UseGuards, Request,ForbiddenException,Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() 
  async findAllUsers() {
    return await this.usersService.findAll();
  }
  @Get('search')
  async searchUsers(@Query('name') name: string) {
    return this.usersService.findByName(name);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateData: UpdateProfileDto,
    @Request() req
  ) {
    if (id !== req.user.userId) {
      throw new ForbiddenException('You are not authorized to update this profile.');
    }
    return this.usersService.updateProfile(id, updateData);
  }
}
