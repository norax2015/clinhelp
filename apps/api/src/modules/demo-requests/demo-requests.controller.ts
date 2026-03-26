import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DemoRequestsService } from './demo-requests.service';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('demo-requests')
@Controller('demo-requests')
export class DemoRequestsController {
  constructor(private svc: DemoRequestsService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateDemoRequestDto) {
    return this.svc.create(dto);
  }
}
