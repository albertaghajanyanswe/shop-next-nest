import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ColorModule } from './color/color.module';
import { CategoryModule } from './category/category.module';
import { FileModule } from './file/file.module';
import { StoreModule } from './store/store.module';
import { OrderModule } from './order/order.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { BrandModule } from './brand/brand.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PlanModule } from './plan/plan.module';
import { StripeModule } from './payment/provider/stripe/stripe.module';
import { PaymentModule } from './payment/payment.module';
import { BillingInfoModule } from './billing-info/billing-info.module';
import { SeedService } from './seeder/SeedService';
import { PrismaService } from './prisma.service';
import { QueryPayloadBuilderService } from './queryPayloadBuilder/QueryPayloadBuilder';
import { CloudinaryFileModule } from './cloudinary-file/cloudinary-file.module';
import { CloudinaryProvider } from './cloudinary-file/cloudinary-file.provider';
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    ColorModule,
    CategoryModule,
    FileModule,
    StoreModule,
    OrderModule,
    StatisticsModule,
    ProductModule,
    ReviewModule,
    BrandModule,
    SubscriptionModule,
    PlanModule,
    StripeModule,
    PaymentModule,
    BillingInfoModule,
    CloudinaryFileModule,
  ],
  controllers: [],
  providers: [PrismaService, SeedService, CloudinaryProvider, QueryPayloadBuilderService],
})
export class AppModule {}
