import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}
  @Get() findAll(@CurrentUser('organizationId') o: string) { return this.svc.findAll(o); }
  @Get(':id') findOne(@Param('id') id: string, @CurrentUser('organizationId') o: string) { return this.svc.findOne(id, o); }
  @Post() invite(@CurrentUser('organizationId') o: string, @Body() body: { email: string; role: string }) { return this.svc.invite(o, body.email, body.role); }
  @Patch(':id') update(@Param('id') id: string, @CurrentUser('organizationId') o: string, @Body() body: { firstName?: string; lastName?: string; title?: string; specialty?: string; npi?: string }) { return this.svc.update(id, o, body); }
}
