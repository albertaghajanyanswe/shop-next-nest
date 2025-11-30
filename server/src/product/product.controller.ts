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
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  GetProductDto,
  GetProductWithDetails,
  GetProductWithDetailsAndCount,
  ProductDto,
} from './dto/product.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOkResponse({ type: GetProductWithDetailsAndCount })
  async getAll(@Query('params') params?: string) {
    return this.productService.getAll(params);
  }
  @Auth()
  @Get('by-storeId/:storeId')
  @ApiOkResponse({ type: GetProductWithDetails, isArray: true })
  async getByStoreId(
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

  @Get('by-categoryId/:categoryId')
  @ApiOkResponse({ type: GetProductWithDetails, isArray: true })
  async getByCategoryId(@Param('categoryId') categoryId: string) {
    return this.productService.getByCategoryId(categoryId);
  }

  @Get('by-brandId/:brandId')
  @ApiOkResponse({ type: GetProductWithDetails, isArray: true })
  async getByBrandId(@Param('brandId') brandId: string) {
    return this.productService.getByBrandId(brandId);
  }

  @Get('similar/:id')
  @ApiOkResponse({ type: GetProductWithDetails, isArray: true })
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(id);
  }

  @Get('most-popular')
  @ApiOkResponse({ type: GetProductWithDetails, isArray: true })
  async getMostPopular(@Query('params') params?: string) {
    return this.productService.getMostPopular(params);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
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
  @Auth()
  @Put(':id')
  @ApiOkResponse({ type: GetProductDto })
  async update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  @ApiOkResponse({ type: GetProductDto })
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
