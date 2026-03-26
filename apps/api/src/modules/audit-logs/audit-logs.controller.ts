import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('audit-logs')
@ApiBearerAuth()
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private svc: AuditLogsService) {}
  @Get() @Roles('super_admin','org_admin') findAll(@CurrentUser('organizationId') o: string, @Query('userId') u?: string, @Query('action') a?: string, @Query('page') p?: number, @Query('limit') l?: number) { return this.svc.findAll(o, { userId: u, action: a, page: p, limit: l }); }
}
