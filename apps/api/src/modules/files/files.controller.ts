import { Controller, Post, Get, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('files')
@ApiBearerAuth()
@Controller('encounters/:encounterId/files')
export class FilesController {
  constructor(private svc: FilesService) {}
  @Post('upload') @UseInterceptors(FileInterceptor('file'))
  upload(@Param('encounterId') eid: string, @UploadedFile() file: Express.Multer.File, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.upload(eid, o, file, u); }
  @Get() findAll(@Param('encounterId') eid: string) { return this.svc.findByEncounter(eid); }
}
