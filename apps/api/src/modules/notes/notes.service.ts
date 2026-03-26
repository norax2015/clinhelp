import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, q: { encounterId?: string; status?: string; page?: number; limit?: number }) {
    const { encounterId, status } = q;
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { encounter: { organizationId } };
    if (encounterId) where.encounterId = encounterId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.note.findMany({
        where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          patient: { select: { firstName: true, lastName: true, mrn: true } },
          provider: { select: { firstName: true, lastName: true, title: true } },
        },
      }),
      this.prisma.note.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, organizationId: string) {
    const note = await this.prisma.note.findFirst({
      where: { id, encounter: { organizationId } },
      include: {
        patient: { select: { firstName: true, lastName: true, mrn: true } },
        provider: { select: { firstName: true, lastName: true, title: true } },
        versions: { orderBy: { versionNumber: 'desc' }, take: 10 },
      },
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async findByEncounter(encounterId: string, organizationId: string) {
    return this.prisma.note.findMany({
      where: { encounterId, encounter: { organizationId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateNoteDto, organizationId: string, userId: string) {
    const enc = await this.prisma.encounter.findFirst({ where: { id: dto.encounterId, organizationId } });
    if (!enc) throw new NotFoundException('Encounter not found');
    const note = await this.prisma.note.create({
      data: {
        encounterId: dto.encounterId,
        patientId: enc.patientId,
        providerId: userId,
        type: dto.type as any,
        status: 'draft',
        content: dto.content,
        structuredContent: dto.structuredContent ? (dto.structuredContent as any) : undefined,
        aiGenerated: dto.aiGenerated || false,
      },
    });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: dto.aiGenerated ? 'note_generate' : 'note_update', resourceType: 'note', resourceId: note.id } });
    return note;
  }

  async update(id: string, dto: UpdateNoteDto, organizationId: string, userId: string) {
    const note = await this.findOne(id, organizationId);
    if (note.status === 'signed') throw new BadRequestException('Cannot edit a signed note');

    const vCount = await this.prisma.noteVersion.count({ where: { noteId: id } });
    await this.prisma.noteVersion.create({ data: { noteId: id, content: note.content, editedById: userId, versionNumber: vCount + 1 } });

    const updated = await this.prisma.note.update({ where: { id }, data: { ...dto } as any });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'note_update', resourceType: 'note', resourceId: id } });
    return updated;
  }

  async finalize(id: string, organizationId: string, userId: string) {
    const note = await this.findOne(id, organizationId);
    if (note.status === 'finalized' || note.status === 'signed') throw new BadRequestException('Note already finalized');
    const updated = await this.prisma.note.update({ where: { id }, data: { status: 'finalized', finalizedAt: new Date() } });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'note_finalize', resourceType: 'note', resourceId: id } });
    return updated;
  }

  async sign(id: string, organizationId: string, userId: string) {
    const note = await this.findOne(id, organizationId);
    if (note.status === 'signed') throw new BadRequestException('Note already signed');
    if (note.status !== 'finalized') throw new BadRequestException('Note must be finalized before signing');
    const updated = await this.prisma.note.update({ where: { id }, data: { status: 'signed', signedAt: new Date(), signedById: userId } });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'note_sign', resourceType: 'note', resourceId: id } });
    return updated;
  }

  async getVersions(id: string, organizationId: string) {
    await this.findOne(id, organizationId); // validates access
    return this.prisma.noteVersion.findMany({ where: { noteId: id }, orderBy: { versionNumber: 'desc' }, take: 20 });
  }
}
