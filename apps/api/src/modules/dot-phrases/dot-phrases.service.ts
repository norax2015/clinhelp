import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateDotPhraseDto } from './dto/create-dot-phrase.dto';

@Injectable()
export class DotPhrasesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, organizationId: string) {
    return this.prisma.dotPhrase.findMany({
      where: { userId, organizationId },
      orderBy: [{ category: 'asc' }, { trigger: 'asc' }],
    });
  }

  async create(userId: string, organizationId: string, dto: CreateDotPhraseDto) {
    return this.prisma.dotPhrase.create({
      data: { ...dto, userId, organizationId },
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.dotPhrase.deleteMany({ where: { id, userId } });
  }
}
