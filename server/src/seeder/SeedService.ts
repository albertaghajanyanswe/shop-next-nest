import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BRANDS_SEEDS, CATEGORIES_SEEDS } from './seed.data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.seedCategories();
    await this.seedBrands();
  }

  private async seedCategories() {
    for (const cat of CATEGORIES_SEEDS) {
      const exists = await this.prisma.category.findUnique({
        where: { name: cat.name },
      });
      if (!exists) {
        await this.prisma.category.create({
          data: { name: cat.name, images: cat.images, rating: cat.rating || 1 },
        });
      }
    }
  }

  private async seedBrands() {
    for (const brand of BRANDS_SEEDS) {
      const exists = await this.prisma.brand.findUnique({
        where: { name: brand.name },
      });
      if (!exists) {
        await this.prisma.brand.create({
          data: {
            name: brand.name,
            images: brand.images,
            rating: brand.rating || 1,
          },
        });
      }
    }
  }
}
