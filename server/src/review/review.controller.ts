import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  GetReviewDto,
  GetReviewWithUserDto,
  GetReviewWithUserDtoAndCount,
  ReviewDto,
} from './dto/review.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Auth()
  @Get('by-storeId/:storeId')
  @ApiOkResponse({ type: GetReviewWithUserDtoAndCount, isArray: true })
  async getByStoreId(
    @Param('storeId') storeId: string,
    @Query('params') params?: string,
  ) {
    return this.reviewService.getByStoreId(storeId, params);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post(':productId/:storeId')
  @ApiOkResponse({ type: GetReviewDto })
  async create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.create(dto, userId, productId, storeId);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  @ApiOkResponse({ type: GetReviewDto })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.reviewService.delete(id, userId);
  }
}
