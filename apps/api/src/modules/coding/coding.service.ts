import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class CodingService {
  constructor(private prisma: PrismaService) {}
  async findByEncounter(encounterId: string) { return this.prisma.codingSuggestion.findMany({ where: { encounterId }, orderBy: { createdAt: 'desc' } }); }
  async updateStatus(id: string, status: string) { return this.prisma.codingSuggestion.update({ where: { id }, data: { status } }); }
}
