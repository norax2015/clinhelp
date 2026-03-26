import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, q: { assignedToId?: string; status?: string; patientId?: string; page?: number; limit?: number }) {
    const { assignedToId, status, patientId } = q;
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { organizationId };
    if (assignedToId) where.assignedToId = assignedToId;
    if (status) where.status = status;
    if (patientId) where.patientId = patientId;
    const [data, total] = await Promise.all([
      this.prisma.task.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
        include: { patient: { select: { firstName: true, lastName: true, mrn: true } }, assignedTo: { select: { firstName: true, lastName: true } } } }),
      this.prisma.task.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateTaskDto, organizationId: string, userId: string) {
    const task = await this.prisma.task.create({
      data: { ...dto, organizationId, createdById: userId, priority: dto.priority as any, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined },
    });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'task_create', resourceType: 'task', resourceId: task.id } });
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, organizationId: string, userId: string) {
    const task = await this.prisma.task.findFirst({ where: { id, organizationId } });
    if (!task) throw new NotFoundException('Task not found');
    const data: any = { ...dto };
    if (dto.status === 'completed') data.completedAt = new Date();
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);
    const updated = await this.prisma.task.update({ where: { id }, data });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'task_update', resourceType: 'task', resourceId: id } });
    return updated;
  }
}
