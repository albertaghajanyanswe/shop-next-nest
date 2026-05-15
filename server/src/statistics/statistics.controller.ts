import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Auth()
  @Get('main/:storeId')
  getMainStatistics(@Param('storeId') storeId: string) {
    return this.statisticsService.getMainStatistics(storeId);
  }

  @Auth()
  @Get('middle/:storeId')
  getMiddleStatistics(@Param('storeId') storeId: string) {
    return this.statisticsService.getMiddleStatistics(storeId);
  }

  @Auth()
  @Get('top-products/:storeId')
  getTopProducts(
    @Param('storeId') storeId: string,
    @Query('limit') limit?: string,
  ) {
    return this.statisticsService.getTopProducts(storeId, limit ? parseInt(limit) : 10);
  }

  @Auth()
  @Get('category-sales/:storeId')
  getCategorySales(@Param('storeId') storeId: string) {
    return this.statisticsService.getCategorySales(storeId);
  }

  @Auth()
  @Get('sales-history/:storeId')
  getSalesHistory(
    @Param('storeId') storeId: string,
    @Query('range') range: '1w' | '1m' | '6m' | '1y' | 'all' = '1m',
  ) {
    return this.statisticsService.getSalesHistory(storeId, range);
  }
}
