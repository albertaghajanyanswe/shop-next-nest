import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        stores: true,
        favorites: {
          include: {
            category: true,
          },
        },
        orders: true,
      },
    });
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { stores: true, favorites: true, orders: true },
    });
    return user;
  }

  async createUser(userDto: AuthDto) {
    const user = await this.prismaService.user.create({
      data: {
        name: userDto.name,
        email: userDto.email,
        password: await hash(userDto.password),
      },
      include: { stores: true, favorites: true, orders: true },
    });
    return user;
  }

  async toggleFavorite(productId: string, userId: string) {
    const user = await this.getById(userId);
    const isExistsProduct = user?.favorites.find(
      (product) => product.id === productId,
    );

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        favorites: {
          [isExistsProduct ? 'disconnect' : 'connect']: { id: productId },
        },
      },
    });

    await this.prismaService.product.update({
      where: { id: productId },
      data: {
        totalLikes: isExistsProduct
          ? isExistsProduct.totalLikes > 0
            ? { decrement: 1 }
            : 0
          : { increment: 1 },
      },
    });

    return {
      status: isExistsProduct ? 'removed' : 'added',
      message: isExistsProduct
        ? 'Favorite product removed'
        : 'Favorite product added',
      productId,
    };
  }
}
