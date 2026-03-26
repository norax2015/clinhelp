import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../config/prisma.service';

const SELECT = { id: true, email: true, firstName: true, lastName: true, role: true, title: true, specialty: true, npi: true, isActive: true, lastLoginAt: true, createdAt: true };

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findAll(organizationId: string) {
    const data = await this.prisma.user.findMany({ where: { organizationId }, select: SELECT, orderBy: { lastName: 'asc' } });
    return { data, total: data.length };
  }
  async findOne(id: string, organizationId: string) {
    const u = await this.prisma.user.findFirst({ where: { id, organizationId }, select: SELECT });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async update(id: string, organizationId: string, data: { firstName?: string; lastName?: string; title?: string; specialty?: string; npi?: string }) {
    await this.findOne(id, organizationId);
    return this.prisma.user.update({ where: { id }, data, select: SELECT });
  }

  async invite(organizationId: string, email: string, role: string) {
    const existing = await this.prisma.user.findFirst({ where: { email, organizationId } });
    if (existing) throw new ConflictException('A user with that email already exists in this organization.');
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    const user = await this.prisma.user.create({
      data: { email, role: role as any, organizationId, firstName: '', lastName: '', passwordHash, isActive: true },
      select: SELECT,
    });
    // In production this would send an invitation email with a reset link
    return { ...user, tempPassword };
  }
}
