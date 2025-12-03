import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { PrismaService } from 'src/prisma.service';
import { QueryPayloadBuilderService } from 'src/queryPayloadBuilder/QueryPayloadBuilder';
import { StoreService } from 'src/store/store.service';

@Module({
  controllers: [ColorController],
  providers: [ColorService, StoreService, QueryPayloadBuilderService, PrismaService],
})
export class ColorModule {}
