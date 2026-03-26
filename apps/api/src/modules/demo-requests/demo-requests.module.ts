import { Module } from '@nestjs/common';
import { DemoRequestsController } from './demo-requests.controller';
import { DemoRequestsService } from './demo-requests.service';
import { PrismaModule } from '../../config/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DemoRequestsController],
  providers: [DemoRequestsService],
})
export class DemoRequestsModule {}
