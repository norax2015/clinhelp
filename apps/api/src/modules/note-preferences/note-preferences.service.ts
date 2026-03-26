import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { UpdateNotePreferenceDto } from './dto/update-note-preference.dto';

@Injectable()
export class NotePreferencesService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(userId: string) {
    const existing = await this.prisma.userNotePreference.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.userNotePreference.create({ data: { userId } });
  }

  async update(userId: string, dto: UpdateNotePreferenceDto) {
    return this.prisma.userNotePreference.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
  }
}
