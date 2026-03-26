import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}
  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({ where: { id }, include: { subscription: true, _count: { select: { users: true, patients: true, encounters: true } } } });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }
  async update(id: string, data: any) { return this.prisma.organization.update({ where: { id }, data }); }
}
