import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('organizations')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationsController {
  constructor(private svc: OrganizationsService) {}
  @Get('me') getMyOrg(@CurrentUser('organizationId') o: string) { return this.svc.findOne(o); }
  @Patch('me') updateMyOrg(@CurrentUser('organizationId') o: string, @Body() body: any) { return this.svc.update(o, body); }
}
