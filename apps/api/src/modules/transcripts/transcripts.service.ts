import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class TranscriptsService {
  constructor(private prisma: PrismaService) {}
  async findByEncounter(encounterId: string) { return this.prisma.transcript.findMany({ where: { encounterId }, orderBy: { createdAt: 'desc' } }); }
}
