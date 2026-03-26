import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, query: { search?: string; status?: string; page?: number; limit?: number }) {
    const { search, status } = query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const where: any = { organizationId };
    if (status) where.status = status;
    if (search) where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { mrn: { contains: search, mode: 'insensitive' } },
    ];
    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { lastName: 'asc' }, include: { diagnoses: { where: { status: 'active' }, take: 3 } } }),
      this.prisma.patient.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, organizationId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id, organizationId },
      include: {
        diagnoses: true,
        medications: { where: { status: 'active' } },
        encounters: { orderBy: { createdAt: 'desc' }, take: 10, include: { provider: { select: { firstName: true, lastName: true, title: true } } } },
        screenings: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!patient) throw new NotFoundException('Patient not found');
    await this.prisma.auditLog.create({ data: { organizationId, action: 'patient_view', resourceType: 'patient', resourceId: id } });
    return patient;
  }

  async create(dto: CreatePatientDto, organizationId: string, userId: string) {
    const mrn = `MRN-${Date.now().toString().slice(-6)}`;
    const patient = await this.prisma.patient.create({
      data: { ...dto, organizationId, mrn, dateOfBirth: new Date(dto.dateOfBirth), sex: dto.sex as any },
    });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'patient_create', resourceType: 'patient', resourceId: patient.id } });
    return patient;
  }

  async update(id: string, dto: UpdatePatientDto, organizationId: string, userId: string) {
    await this.findOne(id, organizationId);
    const data: any = { ...dto };
    if (dto.dateOfBirth) data.dateOfBirth = new Date(dto.dateOfBirth);
    const updated = await this.prisma.patient.update({ where: { id }, data });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'patient_update', resourceType: 'patient', resourceId: id } });
    return updated;
  }

  async getDiagnoses(patientId: string, organizationId: string) {
    const patient = await this.findOne(patientId, organizationId);
    return { data: (patient as any).diagnoses ?? [] };
  }

  async getMedications(patientId: string, organizationId: string) {
    const patient = await this.findOne(patientId, organizationId);
    return { data: (patient as any).medications ?? [] };
  }

  async getEncounters(patientId: string, organizationId: string) {
    const patient = await this.findOne(patientId, organizationId);
    return { data: (patient as any).encounters ?? [] };
  }

  async getScreenings(patientId: string, organizationId: string) {
    const patient = await this.findOne(patientId, organizationId);
    return { data: (patient as any).screenings ?? [] };
  }
}
