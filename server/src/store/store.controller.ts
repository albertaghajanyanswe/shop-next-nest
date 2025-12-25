import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { GetStoreDto, GetStoreDtoAndCount, StoreDto } from './dto/store.dto';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { AuthAndOwner } from 'src/auth/decorators/owner.decorator';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @ApiOkResponse({ type: GetStoreDtoAndCount })
  async getAll(@Query('params') params?: string) {
    return this.storeService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ type: GetStoreDto })
  async getStoreByIdPublic(
    @Param('id') storeId: string,
  ) {
    return this.storeService.getById(storeId);
  }

  @Auth()
  @Get('by-id/:id')
  @ApiResponse({ type: GetStoreDto })
  async getStoreById(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.storeService.getById(storeId, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  @ApiResponse({ type: GetStoreDto })
  async create(@CurrentUser('id') userId: string, @Body() dto: StoreDto) {
    return this.storeService.create(userId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @AuthAndOwner(StoreService, 'id')
  @Put(':id')
  @ApiResponse({ type: GetStoreDto })
  async update(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: StoreDto,
  ) {
    return this.storeService.update(storeId, userId, dto);
  }

  @HttpCode(200)
  @AuthAndOwner(StoreService, 'id')
  @Delete(':id')
  @ApiResponse({ type: GetStoreDto })
  async delete(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.storeService.delete(storeId, userId);
  }
}
