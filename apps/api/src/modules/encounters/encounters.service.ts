import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';

@Injectable()
export class EncountersService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, q: { patientId?: string; status?: string; page?: number; limit?: number; createdAfter?: string }) {
    const { patientId, status, createdAfter } = q;
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { organizationId };
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    if (createdAfter) where.createdAt = { gte: new Date(createdAfter) };
    const [data, total] = await Promise.all([
      this.prisma.encounter.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
        include: { patient: { select: { firstName: true, lastName: true, mrn: true } }, provider: { select: { firstName: true, lastName: true, title: true } } } }),
      this.prisma.encounter.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, organizationId: string) {
    const e = await this.prisma.encounter.findFirst({
      where: { id, organizationId },
      include: {
        patient: true,
        provider: { select: { id: true, firstName: true, lastName: true, title: true, specialty: true } },
        files: true,
        transcripts: { orderBy: { createdAt: 'desc' } },
        noteRecords: { orderBy: { createdAt: 'desc' } },
        screenings: { orderBy: { createdAt: 'desc' } },
        tasks: { where: { status: { not: 'cancelled' } } },
        codingSuggestions: { orderBy: { createdAt: 'desc' }, take: 1 },
        patientInstructions: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!e) throw new NotFoundException('Encounter not found');
    return e;
  }

  async create(dto: CreateEncounterDto, organizationId: string, userId: string) {
    const enc = await this.prisma.encounter.create({
      data: { ...dto, organizationId, providerId: dto.providerId || userId, status: 'in_progress' as any, type: dto.type as any, visitMode: dto.visitMode as any, startedAt: new Date() },
      include: { patient: { select: { firstName: true, lastName: true } } },
    });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'encounter_create', resourceType: 'encounter', resourceId: enc.id } });
    return enc;
  }

  async updateStatus(id: string, status: string, organizationId: string, userId: string) {
    const enc = await this.findOne(id, organizationId);
    const data: any = { status };
    if (status === 'completed') data.completedAt = new Date();
    const updated = await this.prisma.encounter.update({ where: { id: enc.id }, data });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'encounter_update', resourceType: 'encounter', resourceId: id, metadata: { status } } });
    return updated;
  }
}
