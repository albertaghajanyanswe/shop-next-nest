import { Controller } from '@nestjs/common';
import { BillingInfoService } from './billing-info.service';

@Controller('billing-info')
export class BillingInfoController {
  constructor(private readonly billingInfoService: BillingInfoService) {}
}
