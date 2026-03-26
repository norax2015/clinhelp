import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateScreeningDto } from './dto/create-screening.dto';

const SEVERITY_RANGES: Record<string, Array<{ min: number; max: number; severity: string }>> = {
  PHQ9: [{ min: 0, max: 4, severity: 'minimal' }, { min: 5, max: 9, severity: 'mild' }, { min: 10, max: 14, severity: 'moderate' }, { min: 15, max: 19, severity: 'moderately_severe' }, { min: 20, max: 27, severity: 'severe' }],
  GAD7: [{ min: 0, max: 4, severity: 'minimal' }, { min: 5, max: 9, severity: 'mild' }, { min: 10, max: 14, severity: 'moderate' }, { min: 15, max: 21, severity: 'severe' }],
  AUDIT: [{ min: 0, max: 7, severity: 'minimal' }, { min: 8, max: 15, severity: 'mild' }, { min: 16, max: 19, severity: 'moderate' }, { min: 20, max: 40, severity: 'severe' }],
  CSSRS: [{ min: 0, max: 0, severity: 'none' }, { min: 1, max: 2, severity: 'mild' }, { min: 3, max: 4, severity: 'moderate' }, { min: 5, max: 5, severity: 'severe' }],
};

@Injectable()
export class ScreeningsService {
  constructor(private prisma: PrismaService) {}

  private getSeverity(type: string, score: number): string {
    const ranges = SEVERITY_RANGES[type] || [];
    return ranges.find(r => score >= r.min && score <= r.max)?.severity || 'minimal';
  }

  async findAll(organizationId: string, q: { patientId?: string; page?: number; limit?: number }) {
    const { patientId } = q;
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { patient: { organizationId } };
    if (patientId) where.patientId = patientId;
    const [data, total] = await Promise.all([
      this.prisma.screening.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
        include: { patient: { select: { firstName: true, lastName: true, mrn: true } } } }),
      this.prisma.screening.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateScreeningDto, userId: string) {
    const score = dto.responses.reduce((s, r) => s + (r.answer || 0), 0);
    const severity = this.getSeverity(dto.type, score);
    const screening = await this.prisma.screening.create({
      data: {
        patientId: dto.patientId,
        encounterId: dto.encounterId,
        administeredById: userId,
        type: dto.type as any,
        responses: dto.responses as any,
        totalScore: score,
        severity: severity as any,
        notes: dto.notes,
      },
    });
    await this.prisma.auditLog.create({ data: { organizationId: dto.organizationId, userId, action: 'screening_submit', resourceType: 'screening', resourceId: screening.id, metadata: { type: dto.type, score, severity } } });
    return { ...screening, score, severity };
  }

  async findByPatient(patientId: string) {
    return this.prisma.screening.findMany({ where: { patientId }, orderBy: { createdAt: 'desc' } });
  }
}
