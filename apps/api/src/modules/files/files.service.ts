import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async upload(encounterId: string, organizationId: string, file: Express.Multer.File, userId: string) {
    const enc = await this.prisma.encounter.findFirst({ where: { id: encounterId, organizationId } });
    if (!enc) throw new NotFoundException('Encounter not found');
    const storageKey = `${organizationId}/${encounterId}/${uuidv4()}-${file.originalname}`;
    // TODO: Upload to S3-compatible storage (AWS S3, R2, MinIO) using env-configured client
    const record = await this.prisma.encounterFile.create({
      data: { encounterId, filename: file.originalname, originalName: file.originalname, mimeType: file.mimetype, size: file.size, storageKey, type: file.mimetype.startsWith('audio') ? 'audio' : 'document' },
    });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'file_upload', resourceType: 'file', resourceId: record.id } });
    return record;
  }

  async findByEncounter(encounterId: string) {
    return this.prisma.encounterFile.findMany({ where: { encounterId } });
  }
}
