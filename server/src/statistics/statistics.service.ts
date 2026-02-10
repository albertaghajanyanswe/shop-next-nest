import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma.service';

dayjs.locale('en');

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getMainStatistics(storeId: string) {
    const totalRevenue = await this.calculateTotalRevenue(storeId);

    const productsCount = await this.countProducts(storeId);
    const categoriesCount = await this.countCategories(storeId);

    const averageRating = await this.calculateAverageRating(storeId);

    return [
      { id: 1, name: 'Revenue', value: totalRevenue },
      { id: 2, name: 'Products', value: productsCount },
      { id: 3, name: 'Categories', value: categoriesCount },
      { id: 4, name: 'Average Rating', value: averageRating },
    ];
  }

  async getMiddleStatistics(storeId: string) {
    const monthlySales = await this.calculateMonthlySales(storeId);
    const lastUsers = await this.getLastUsers(storeId);
    return { monthlySales, lastUsers };
  }

  private async calculateTotalRevenue(storeId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            store: { id: storeId },
          },
        },
      },
      include: {
        orderItems: {
          where: { storeId },
        },
      },
    });

    const totalRevenue = orders.reduce((acc, order) => {
      const total = order.orderItems.reduce((itemAcc, item) => {
        return itemAcc + item.price * item.quantity;
      }, 0);
      return acc + total;
    }, 0);

    return totalRevenue;
  }

  private async countProducts(storeId: string) {
    const productsCount = await this.prisma.product.count({
      where: { storeId },
    });

    return productsCount;
  }

  private async countCategories(storeId: string) {
    const categoriesCount = await this.prisma.category.count({
      where: { storeId },
    });

    return categoriesCount;
  }

  private async calculateAverageRating(storeId: string) {
    const averageRating = await this.prisma.review.aggregate({
      where: { storeId },
      _avg: { rating: true },
    });

    return averageRating._avg.rating;
  }

  private async calculateMonthlySales(storeId: string) {
    const startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();

    const salesRow = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        orderItems: {
          some: { storeId },
        },
      },
      include: {
        orderItems: {
          where: {
            storeId, // Фильтруем только orderItems с нужным storeId
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Сортируем при запросе
      },
    });

    const formatDate = (date: Date): string => {
      return `${date.getDate()} ${monthNames[date.getMonth()]}`;
    };

    // Используем Map для хранения даты с её timestamp для последующей сортировки
    const salesByDate = new Map<string, { value: number; timestamp: number }>();
    salesRow.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const formattedDate = formatDate(orderDate);
      const total = order.orderItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      if (salesByDate.has(formattedDate)) {
        const existing = salesByDate.get(formattedDate)!;
        salesByDate.set(formattedDate, {
          value: existing.value + total,
          timestamp: existing.timestamp,
        });
      } else {
        salesByDate.set(formattedDate, {
          value: total,
          timestamp: orderDate.getTime(),
        });
      }
    });

    // Сортируем по timestamp
    const monthlySales = Array.from(salesByDate, ([date, data]) => ({
      date,
      value: data.value,
      timestamp: data.timestamp,
    }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ date, value }) => ({ date, value })); // Убираем timestamp из финального результата

    return monthlySales;
  }

  private async getLastUsers(storeId: string) {
    const lastUsers = await this.prisma.user.findMany({
      where: {
        orders: {
          some: {
            orderItems: { some: { storeId } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        orders: {
          where: {
            orderItems: { some: { storeId } },
          },
          include: {
            orderItems: {
              where: { storeId },
              select: { price: true },
            },
          },
        },
      },
    });

    return lastUsers.map((user) => {
      const lastOrder = user.orders[user.orders.length - 1];

      const total = lastOrder.orderItems.reduce((total, item) => {
        return total + item.price;
      }, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        total,
      };
    });
  }
}
