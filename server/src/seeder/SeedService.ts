import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    console.log('PROCESS ', process.env);
    await this.seedCategories();
    await this.seedBrands();
  }

  private async seedCategories() {
    const categories = [
      'Smartphones',
      'Notebooks',
      'Television',
      'Smart Watches',
      'Tablets',
      'Kitchen Appliances',
      'Refrigerators',
      'Washing Machine',
    ];

    for (const name of categories) {
      const exists = await this.prisma.category.findUnique({
        where: { name },
      });
      if (!exists) {
        await this.prisma.category.create({ data: { name } });
      }
    }
  }

  private async seedBrands() {
    const brands = [
      'Apple',
      'Samsung',
      'Sony',
      'Dell',
      'Lenovo',
      'Acer',
      'Asus',
      'Mercedes',
      'BMW',
      'Toyota',
    ];

    // Предположим, что brands не привязаны к категориям сразу
    for (const name of brands) {
      const exists = await this.prisma.brand.findUnique({ where: { name } });
      if (!exists) {
        await this.prisma.brand.create({ data: { name } });
      }
    }
  }
}
