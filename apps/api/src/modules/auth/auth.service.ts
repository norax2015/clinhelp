import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../config/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { organization: true },
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await this.prisma.auditLog.create({
      data: { organizationId: user.organizationId, userId: user.id, action: 'login', ipAddress: dto.ipAddress, userAgent: dto.userAgent },
    });

    const payload = { sub: user.id, email: user.email, role: user.role, organizationId: user.organizationId };
    const { passwordHash: _, ...userOut } = user;
    return { accessToken: this.jwtService.sign(payload), user: userOut };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...profile } = user;
    return profile;
  }
}
