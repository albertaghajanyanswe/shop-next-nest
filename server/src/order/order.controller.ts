import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  GetOrderDto,
  GetOrderItemsDetailsDtoAndCount,
  GetOrderWithItemsDto,
  GetOrderWithItemsDtoAndCount,
  OrderDto,
} from './dto/order.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { PaymentStatusDto } from './dto/payment-status.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import type { User } from '@prisma/client';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
  @Get()
  @ApiOkResponse({ type: GetOrderWithItemsDtoAndCount })
  async getAll(@CurrentUser() user: User, @Query('params') params?: string) {
    return this.orderService.getAll(user, params);
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

  @Get('/:id')
  @ApiOkResponse({ type: GetOrderWithItemsDto, isArray: true })
  async getById(@CurrentUser() user: User, @Param('id') id: string) {
    return this.orderService.getById(user, id);
  }

  // @UsePipes(new ValidationPipe())
  // @HttpCode(200)
  // @Post('place')
  // @Auth()
  // async checkoutYookassa(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
  //   return this.orderService.createPayment(dto, userId);
  // }

  // @HttpCode(200)
  // @Post('status')
  // @Auth()
  // async updateStatus(@Body() dto: PaymentStatusDto) {
  //   return this.orderService.updateStatus(dto);
  // }

  // @UsePipes(new ValidationPipe())
  // @HttpCode(200)
  // @Post('pay')
  // @Auth()
  // async checkoutStripe(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
  //   return this.orderService.pay(dto, userId);
  // }
}
