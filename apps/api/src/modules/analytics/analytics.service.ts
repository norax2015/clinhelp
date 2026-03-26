import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(organizationId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay());

    const [totalPatients, activePatients, totalEncounters, encountersThisMonth, totalNotes, aiNotes, totalScreenings, pendingTasks, completedThisWeek] = await Promise.all([
      this.prisma.patient.count({ where: { organizationId } }),
      this.prisma.patient.count({ where: { organizationId, status: 'active' } }),
      this.prisma.encounter.count({ where: { organizationId } }),
      this.prisma.encounter.count({ where: { organizationId, createdAt: { gte: startOfMonth } } }),
      this.prisma.note.count({ where: { encounter: { organizationId } } }),
      this.prisma.note.count({ where: { encounter: { organizationId }, aiGenerated: true } }),
      this.prisma.screening.count({ where: { patient: { organizationId } } }),
      this.prisma.task.count({ where: { organizationId, status: { in: ['pending','in_progress'] } } }),
      this.prisma.task.count({ where: { organizationId, status: 'completed', completedAt: { gte: startOfWeek } } }),
    ]);

    return {
      totalPatients, activePatients, totalEncounters, encountersThisMonth, totalNotes,
      notesGeneratedByAI: aiNotes, totalScreenings, pendingTasks, completedTasksThisWeek: completedThisWeek,
      avgNotesPerEncounter: totalEncounters > 0 ? Number((totalNotes / totalEncounters).toFixed(1)) : 0,
    };
  }
}
