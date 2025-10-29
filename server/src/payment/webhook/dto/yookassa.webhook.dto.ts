import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum PaymentStatusEnum {
  PENDING = 'pending',
  WAITING_FOR_CAPTURE = 'waiting_for_capture',
  SUCCEEDED = 'succeeded',
  CANCELED = 'canceled',
}

export enum PaymentMethodEnum {
  BANK_CARD = 'bank_card',
  YOO_MONEY = 'yoo_money',
  CASH = 'cash',
  MOBILE_BALANCE = 'mobile_balance',
  SBERBANK = 'sberbank',
  ALFABANK = 'alfabank',
  TINKOFF_BANK = 'tinkoff_bank',
  QIWI = 'qiwi',
  WEBMONEY = 'webmoney',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

export class CardProduct {
  @IsString()
  public code: string;
}

export class Card {
  @IsString()
  public first6: string;

  @IsString()
  public last4: string;

  @IsString()
  public expiry_year: string;

  @IsString()
  public expiry_month: string;

  @IsString()
  public card_type: string;

  @IsString()
  public issuer_country: string;
}

export class PaymentMethod {
  @IsEnum(PaymentMethodEnum)
  public type: PaymentMethodEnum;

  @IsString()
  public id: string;

  @IsBoolean()
  public saved: boolean;

  @IsString()
  public status: string;

  @IsString()
  public title: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Card)
  public card?: Card;
}

export class Amount {
  @IsString()
  public value: string;

  @IsString()
  public currency: string;
}

export class Recipient {
  @IsString()
  public account_id: string;

  @IsString()
  public gateway_id: string;
}

export class ThreeDSecure {
  @IsBoolean()
  public applied: boolean;

  @IsBoolean()
  public method_completed: boolean;

  @IsBoolean()
  public challenge_required: boolean;
}

export class AuthorizationDetail {
  @IsString()
  public rrn: string;

  @IsString()
  public auth_code: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ThreeDSecure)
  public three_d_secure?: ThreeDSecure;
}
export class PaymentObject {
  @IsString()
  public id: string;

  @IsEnum(PaymentStatusEnum)
  public status: PaymentStatusEnum;

  @ValidateNested()
  @Type(() => Amount)
  public amount: Amount;

  @IsOptional()
  @ValidateNested()
  @Type(() => Amount)
  public income_amount: Amount;

  @IsOptional()
  @ValidateNested()
  @Type(() => Amount)
  public refunded_amount: Amount;

  @IsString()
  public description: string;

  @ValidateNested()
  @Type(() => Recipient)
  public recipient: Recipient;

  @ValidateNested()
  @Type(() => PaymentMethod)
  public payment_method: PaymentMethod;

  @IsString()
  public created_at?: object;

  @IsOptional()
  @IsString()
  public expires_at?: object;

  @IsBoolean()
  public test: boolean;

  @IsBoolean()
  public paid: boolean;

  @IsBoolean()
  public refundable: boolean;

  @IsOptional()
  @IsObject()
  public metadata?: Record<string, any>;

  @IsOptional()
  @ValidateNested()
  @Type(() => AuthorizationDetail)
  public authorization_detail?: AuthorizationDetail;
}
export class YookassaWebhookDto {
  @IsString()
  public type: string;

  @IsString()
  public event: string;

  @ValidateNested()
  @Type(() => PaymentObject)
  public object: PaymentObject;
}
