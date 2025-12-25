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
import { ProductService } from './product.service';
import {
  GetProductDto,
  GetProductWithDetails,
  GetProductWithDetailsAndCount,
  ProductDto,
} from './dto/product.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthAndOwner } from 'src/auth/decorators/owner.decorator';
import { StoreService } from 'src/store/store.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOkResponse({ type: GetProductWithDetailsAndCount })
  async getAll(@Query('params') params?: string) {
    return this.productService.getAll(params);
  }

  @Get('store/:storeId')
  @ApiOkResponse({ type: GetProductWithDetailsAndCount })
  async getByStoreIdPublic(
    @Param('storeId') storeId: string,
    @Query('params') params?: string,
  ) {
    return this.productService.getByStoreId(storeId, params);
  }

  @AuthAndOwner(StoreService, 'storeId')
  @Get('by-storeId/:storeId')
  @ApiOkResponse({ type: GetProductWithDetails, isArray: true })
  async getByStoreId(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Query('params') params?: string,
  ) {
    return this.productService.getByStoreId(storeId, params);
  }

  @Get('by-id/:id')
  @ApiOkResponse({ type: GetProductWithDetails })
  async getById(@Param('id') id: string) {
    return this.productService.getById(id);
  }

  @Get('product-by-id/:id')
  @ApiOkResponse({ type: GetProductWithDetails })
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Get('similar/:id')
  @ApiOkResponse({ type: GetProductWithDetails, isArray: true })
  async getSimilar(@Param('id') id: string, @Query('params') params?: string) {
    return this.productService.getSimilar(id, params);
  }

  @Get('most-popular')
  @ApiOkResponse({ type: GetProductWithDetails, isArray: true })
  async getMostPopular(@Query('params') params?: string) {
    return this.productService.getMostPopular(params);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @AuthAndOwner(StoreService, 'storeId')
  @Post(':storeId')
  @ApiOkResponse({ type: GetProductDto })
  async create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Body() dto: ProductDto,
  ) {
    return this.productService.create(storeId, userId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @AuthAndOwner(ProductService, 'id')
  @Put(':id')
  @ApiOkResponse({ type: GetProductDto })
  async update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(id, dto);
  }

  @HttpCode(200)
  @AuthAndOwner(ProductService, 'id')
  @Delete(':id')
  @ApiOkResponse({ type: GetProductDto })
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
