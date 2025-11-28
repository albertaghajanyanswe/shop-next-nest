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

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get('')
  @ApiOkResponse({ type: GetColorDtoAndCount })
  async getAll(@Query('params') params?: string) {
    return this.colorService.getAll(params);
  }

  @Auth()
  @Get('by-storeId/:storeId')
  @ApiOkResponse({ type: GetColorDto, isArray: true })
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.colorService.getByStoreId(storeId);
  }

  @Auth()
  @Get('by-id/:id')
  @ApiOkResponse({ type: GetColorDto })
  async getById(@Param('id') id: string) {
    return this.colorService.getById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  @ApiOkResponse({ type: GetColorDto })
  async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
    return this.colorService.create(storeId, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  @ApiOkResponse({ type: GetColorDto })
  async update(@Param('id') id: string, @Body() dto: ColorDto) {
    return this.colorService.update(id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  @ApiOkResponse({ type: GetColorDto })
  async delete(@Param('id') id: string) {
    return this.colorService.delete(id);
  }
}
