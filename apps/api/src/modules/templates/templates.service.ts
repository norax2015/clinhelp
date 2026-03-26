import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.noteTemplate.findMany({
      where: { organizationId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      include: { createdBy: { select: { firstName: true, lastName: true } } },
    });
  }

  async findOne(id: string, organizationId: string) {
    const template = await this.prisma.noteTemplate.findFirst({
      where: { id, organizationId },
    });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async create(organizationId: string, userId: string, dto: CreateTemplateDto) {
    return this.prisma.noteTemplate.create({
      data: { ...dto, organizationId, createdById: userId },
    });
  }

  async update(id: string, organizationId: string, dto: UpdateTemplateDto) {
    const template = await this.prisma.noteTemplate.findFirst({ where: { id, organizationId } });
    if (!template) throw new NotFoundException('Template not found');
    return this.prisma.noteTemplate.update({ where: { id }, data: dto });
  }

  async remove(id: string, organizationId: string) {
    const template = await this.prisma.noteTemplate.findFirst({ where: { id, organizationId } });
    if (!template) throw new NotFoundException('Template not found');
    return this.prisma.noteTemplate.delete({ where: { id } });
  }
}
