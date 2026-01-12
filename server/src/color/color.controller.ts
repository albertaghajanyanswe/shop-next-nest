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
import { ColorService } from './color.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ColorDto, GetColorDto, GetColorDtoAndCount } from './dto/color.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthAndOwner } from 'src/auth/decorators/owner.decorator';
import { StoreService } from 'src/store/store.service';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get('')
  @ApiOkResponse({ type: GetColorDtoAndCount })
  async getAll(@Query('params') params?: string) {
    return this.colorService.getAll(params);
  }

  @AuthAndOwner(StoreService, 'storeId')
  @Get('by-storeId/:storeId')
  @ApiOkResponse({ type: GetColorDto, isArray: true })
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.colorService.getByStoreId(storeId);
  }

  @Auth()
  @Get(':id')
  @ApiOkResponse({ type: GetColorDto })
  async getById(@Param('id') id: string) {
    return this.colorService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @AuthAndOwner(StoreService, 'storeId')
  @Post(':storeId')
  @ApiOkResponse({ type: GetColorDto })
  async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
    return this.colorService.create(storeId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @AuthAndOwner(ColorService, 'id')
  @Put(':id')
  @ApiOkResponse({ type: GetColorDto })
  async update(@Param('id') id: string, @Body() dto: ColorDto) {
    return this.colorService.update(id, dto);
  }

  @HttpCode(200)
  @AuthAndOwner(ColorService, 'id')
  @Delete(':id')
  @ApiOkResponse({ type: GetColorDto })
  async delete(@Param('id') id: string) {
    return this.colorService.delete(id);
  }
}
