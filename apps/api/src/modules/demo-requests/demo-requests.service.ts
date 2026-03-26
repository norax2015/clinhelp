import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto';

@Injectable()
export class DemoRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDemoRequestDto) {
    return this.prisma.demoRequest.create({ data: dto });
  }
}
