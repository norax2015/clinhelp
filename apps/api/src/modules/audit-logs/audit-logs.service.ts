import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, q: { userId?: string; action?: string; page?: number; limit?: number }) {
    const { userId, action } = q;
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 50;
    const where: any = { organizationId };
    if (userId) where.userId = userId;
    if (action) where.action = action;
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { user: { select: { firstName: true, lastName: true, email: true, role: true } } } }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
