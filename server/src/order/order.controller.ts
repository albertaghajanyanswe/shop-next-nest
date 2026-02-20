import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  GetOrderDto,
  GetOrderItemsDetailsDto,
  GetOrderItemsDetailsDtoAndCount,
  GetOrderWithItemsDto,
  GetOrderWithItemsDtoAndCount,
} from './dto/order.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { UpdateOrderDto, UpdateOrderItemDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth()
  @Get()
  @ApiOkResponse({ type: GetOrderWithItemsDtoAndCount })
  async getOrders(@CurrentUser() user: User, @Query('params') params?: string) {
    return this.orderService.getOrders(user, params);
  }

  // @Auth()
  // @Get('/sold')
  // @ApiOkResponse({ type: GetOrderWithItemsDtoAndCount })
  // async getSoldOrders(
  //   @CurrentUser() user: User,
  //   @Query('params') params?: string,
  // ) {
  //   return this.orderService.getSoldOrders(user, params);
  // }

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
    return this.orderService.getById(user, id);
  }

  @HttpCode(200)
  @Auth()
  @Put('/orderItems/:id')
  @ApiOkResponse({ type: GetOrderItemsDetailsDto })
  async updateOrderItem(
    @Param('id') id: string,
    @Body() dto: UpdateOrderItemDto,
  ) {
    return this.orderService.updateOrderItem(id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Put(':id')
  @ApiOkResponse({ type: GetOrderDto })
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(id, dto);
  }
}
