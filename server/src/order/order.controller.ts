import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  GetOrderItemsDetailsDtoAndCount,
  GetOrderWithItemsDto,
  GetOrderWithItemsDtoAndCount,
} from './dto/order.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import type { User } from '@prisma/client';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth()
  @Get()
  @ApiOkResponse({ type: GetOrderWithItemsDtoAndCount })
  async getAll(@CurrentUser() user: User, @Query('params') params?: string) {
    return this.orderService.getAll(user, params);
  }

  @Auth()
  @Get('/sold')
  @ApiOkResponse({ type: GetOrderWithItemsDtoAndCount })
  async getSoldOrders(
    @CurrentUser() user: User,
    @Query('params') params?: string,
  ) {
    return this.orderService.getSoldOrders(user, params);
  }

  @Auth()
  @Get('/allOrders')
  @ApiOkResponse({ type: GetOrderWithItemsDtoAndCount })
  async getAllOrders(
    @CurrentUser() user: User,
    @Query('params') params?: string,
  ) {
    return this.orderService.getAllOrders(user, params);
  }

  @Auth()
  @Get('/orderItems')
  @ApiOkResponse({ type: GetOrderItemsDetailsDtoAndCount })
  async getOrderItems(
    @CurrentUser() user: User,
    @Query('params') params?: string,
  ) {
    return this.orderService.getOrderItems(user, params);
  }

  @Auth()
  @Get('/:id')
  @ApiOkResponse({ type: GetOrderWithItemsDto, isArray: true })
  async getById(@CurrentUser() user: User, @Param('id') id: string) {
    console.log('\n\n ---USER = ', user)
    return this.orderService.getById(user, id);
  }
}
