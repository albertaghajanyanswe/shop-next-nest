import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BillingPeriod,
  EnumOrderItemStatus,
  EnumOrderStatus,
  EnumSubscriptionStatus,
  EnumSubscriptionType,
  Order,
  PaymentProvider,
  Plan,
  Subscription,
  User,
} from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import Stripe from 'stripe';
import type { Request, Response } from 'express';
import { excludeFields } from 'src/utils/types/stripe';
import { OrderDto } from 'src/order/dto/order.dto';
import { EnvVariables } from 'src/utils/constants/variables';
import { CreatePlanType } from 'src/payment/dto';
import { PaymentWebhookResult } from 'src/payment/interfaces';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { validateOrderItemsAvailability } from 'src/utils/productAvailableHelper';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private orderService: OrderService,
  ) {
    this.stripe = new Stripe(
      configService.get<string>(EnvVariables.STRIPE_SECRET_KEY) as string,
      {
        apiVersion: '2025-10-29.clover',
      },
    );
  }

  async onModuleInit() {
    await this.initializeSubscriptionPlans();
  }

  private async createStripePrice(plan: CreatePlanType) {
    console.log('\n\n [Func] createStripePrice');
    const price = await this.stripe.prices.create({
      unit_amount: plan.price * 100,
      currency: 'usd',
      recurring: {
        interval: plan.period === BillingPeriod.MONTHLY ? 'month' : 'year',
      },
      product: plan.stripeProductId,
    });
    return price;
  }

  async createStripeProduct(plan: CreatePlanType) {
    console.log('\n\n [Func] createStripeProduct');
    const stripeProduct = await this.stripe.products.create({
      name: `${plan.planId.split('_')[0]} ${plan.period} PLAN`,
      default_price_data: {
        currency: 'USD',
        unit_amount: plan.price || 0,
        recurring: {
          interval: plan.period === BillingPeriod.MONTHLY ? 'month' : 'year',
          interval_count: 1,
        },
      },
    });
    return stripeProduct;
  }

  async createStripeProductAndPlan(plan: CreatePlanType) {
    console.log('\n\n [Func] createStripeProductAndPlan');

    const stripeProd = await this.createStripeProduct(plan);
    await this.prisma.plan.create({
      data: { ...plan, stripeProductId: stripeProd.id },
    });
  }

  private async initializeSubscriptionPlans() {
    console.log('\n\n [Func] initializeSubscriptionPlans');

    const existingPlans = await this.prisma.plan.findMany();
    if (existingPlans.length > 1) {
      return;
    }

    // const advanced = await this.stripe.products.create({
    //   name: 'Advanced Plan',
    //   description: 'Advanced plan with more features',
    // });
    // const premium = await this.stripe.products.create({
    //   name: 'Premium Plan',
    //   description: 'Premium plan with all features',
    // });

    const plans: CreatePlanType[] = [
      {
        planId: EnumSubscriptionType.FREE,
        description: 'Free plan with limited features',
        isPopular: false,
        period: BillingPeriod.MONTHLY,
        storeLimit: 1,
        productLimit: 10,
        price: 0,
        stripeProductId: '',
        stripePriceId: '',
        features: ['1 Store', '10 Products', 'Basic Support'],
      },
      {
        planId: EnumSubscriptionType.ADVANCED,
        description: 'Advanced monthly plan with more features',
        isPopular: true,
        period: BillingPeriod.MONTHLY,
        storeLimit: 5,
        productLimit: 150,
        price: 1,
        stripeProductId: '', // advanced.id,
        stripePriceId: '',
        features: [
          '5 Stores',
          '150 Products',
          'Priority Support',
          'Advanced Analytics',
        ],
      },
      {
        planId: EnumSubscriptionType.ADVANCED_ANNUAL,
        description: 'Advanced annual plan with more features',
        isPopular: true,
        period: BillingPeriod.YEARLY,
        storeLimit: 5,
        productLimit: 150,
        price: 1 * 10,
        stripeProductId: '', // advanced.id,
        stripePriceId: '',
        features: [
          '5 Stores',
          '150 Products',
          'Priority Support',
          'Advanced Analytics',
        ],
      },
      {
        planId: EnumSubscriptionType.PREMIUM,
        description: 'Premium monthly plan with all features',
        isPopular: false,
        period: BillingPeriod.MONTHLY,
        storeLimit: -1,
        productLimit: -1,
        price: 2,
        stripeProductId: '', // premium.id,
        stripePriceId: '',
        features: [
          'Unlimited Stores',
          'Unlimited Products',
          '24/7 Support',
          'All Analytics Features',
        ],
      },
      {
        planId: EnumSubscriptionType.PREMIUM_ANNUAL,
        description: 'Premium annual plan with all features',
        isPopular: false,
        period: BillingPeriod.YEARLY,
        storeLimit: -1,
        productLimit: -1,
        price: 2 * 10,
        stripeProductId: '', // premium.id,
        stripePriceId: '',
        features: [
          'Unlimited Stores',
          'Unlimited Products',
          '24/7 Support',
          'All Analytics Features',
        ],
      },
    ];

    for (const plan of plans) {
      // let stripePriceId = '';
      let stripeProductId = '';
      if (EnumSubscriptionType.FREE !== plan.planId) {
        // const price = await this.createStripePrice(plan);
        // stripePriceId = price.id;
        const product = await this.createStripeProduct(plan);
        stripeProductId = product.id;
      }
      await this.prisma.plan.create({
        data: { ...plan, stripeProductId },
      });
    }
  }

  getStripe() {
    return this.stripe;
  }

  async cancelUpgrade(userId: string) {
    console.log('\n\n [Func] cancelUpgrade', userId);
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: EnumSubscriptionStatus.ACTIVE },
    });
    if (!sub) throw new BadRequestException('Subscription not found');
    if (!sub.nextPlanId) throw new BadRequestException('No next plan');
    await this.stripe.subscriptions.update(sub.stripeSubscriptionId as string, {
      cancel_at_period_end: false,
    });
    console.log('13.13.13 Update Sub');
    await this.prisma.subscription.update({
      where: { id: sub.id },
      data: { nextPlanId: null },
    });
    return `${process.env.CLIENT_URL}/billing?success=true&downgrade=false&cancel=true`;
  }

  async upgradeSubscription(user: User, plan: Plan): Promise<string> {
    try {
      console.log('\n\n [Func] upgradeSubscription', user.id, plan.planId);

      const planId = plan.planId;
      const sub = await this.prisma.subscription.findFirst({
        where: { userId: user.id, status: EnumSubscriptionStatus.ACTIVE },
      });
      if (!sub) throw new BadRequestException('Subscription not found');
      if (sub.planId == planId) {
        throw new BadRequestException('Already have subscription');
      }

      if (sub.nextPlanId) {
        if (sub.nextPlanId == planId) {
          throw new BadRequestException('Already have subscription');
        }
        await this.cancelUpgrade(user.id);
      }

      const currPlan = await this.prisma.plan.findUnique({
        where: { planId },
      });
      if (!currPlan)
        throw new BadRequestException(
          `There is no subscription with id ${planId}`,
        );

      const oldPlan = await this.prisma.plan.findUnique({
        where: { planId: sub.planId },
      });

      if (currPlan.price > (oldPlan?.price || 0)) {
        console.log('\n\n upgradeSubscription - UPGRADE');
        const url = await this.createCheckoutSessionSubscription(user, plan);
        return url;
      } else {
        console.log('\n\n upgradeSubscription - DOWNGRADE');
        try {
          await this.stripe.subscriptions.update(
            sub.stripeSubscriptionId as string,
            {
              cancel_at_period_end: true,
              metadata: { next_plan_id: currPlan.planId },
            },
          );
        } catch (err) {
          console.log(`StripeService.upgradeSubscription() : failed: ${err}`);
        }
        console.log('14.14.14 Update Sub');
        await this.prisma.subscription.update({
          where: { id: sub.id },
          data: { nextPlanId: planId },
        });
        return `${process.env.CLIENT_URL}/billing?success=true&downgrade=true&planId=${planId}`;
      }
    } catch (err) {
      console.log(`StripeService.upgradeSubscription() : failed: ${err}`);
      throw new BadRequestException(
        err?.message || 'Failed to upgrade subscription',
      );
    } finally {
      console.log('\n\n [Func END] upgradeSubscription');
    }
  }

  async createCustomer(userId: string) {
    console.log('\n\n [Func] createCustomer', userId);
    const clock = await this.createStripeTestClock(`CustomerClock-${userId}`);
    const localCustomer = await this.prisma.billingInfo.findUnique({
      where: { userId },
    });
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (localCustomer) {
      let stripeCustomer: Stripe.Customer | Stripe.DeletedCustomer | undefined;

      stripeCustomer = await this.stripe.customers.retrieve(
        localCustomer.stripeCustomerId as string,
      );
      if (stripeCustomer) {
        if (stripeCustomer.deleted) {
          const newStripeCustomer = await this.stripe.customers.create({
            name: userId,
            email: user.email,
            metadata: {
              userId,
            },
            test_clock: clock.id,
          });

          await this.prisma.billingInfo.update({
            where: { id: localCustomer.id },
            data: {
              stripeCustomerId: newStripeCustomer.id,
              stripeTestClockId: clock.id,
            },
          });
        } else {
          await this.stripe.customers.update(
            localCustomer.stripeCustomerId as string,
            {
              name: userId,
              email: user.email,
              metadata: {
                userId,
              },
            },
          );
        }
      } else {
        const customers = await this.stripe.customers.search({
          query: `metadata['userId']:'${userId}'`,
          limit: 100,
        });
        stripeCustomer = customers.data.find((c) => !c.deleted);
        if (stripeCustomer) {
          await this.prisma.billingInfo.update({
            where: { id: localCustomer.id },
            data: {
              stripeCustomerId: stripeCustomer.id,
            },
          });
        } else {
          const newStripeCustomer = await this.stripe.customers.create({
            name: userId,
            email: user.email,
            metadata: {
              userId,
            },
            test_clock: clock.id,
          });

          await this.prisma.billingInfo.update({
            where: { id: localCustomer.id },
            data: {
              stripeCustomerId: newStripeCustomer.id,
              stripeTestClockId: clock.id,
            },
          });
        }
      }

      return this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          stores: true,
          orders: true,
          subscription: true,
          billingInfo: true,
        },
      });
    } else {
      const customers = await this.stripe.customers.search({
        query: `metadata['userId']:'${userId}'`,
        limit: 100,
      });
      const stripeCustomer = customers.data.find((c) => !c.deleted);
      if (stripeCustomer) {
        await this.prisma.billingInfo.create({
          data: {
            userId: userId,
            serviceId: 'stripe',
            stripeCustomerId: stripeCustomer.id,
          },
        });
      } else {
        const newStripeCustomer = await this.stripe.customers.create({
          name: userId,
          email: user.email,
          metadata: {
            userId,
          },
          test_clock: clock.id,
        });
        await this.prisma.billingInfo.create({
          data: {
            userId: userId,
            serviceId: 'stripe',
            stripeCustomerId: newStripeCustomer.id,
            stripeTestClockId: clock.id,
          },
        });
      }

      return this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          stores: true,
          orders: true,
          subscription: true,
          billingInfo: true,
        },
      });
    }
  }

  async createCheckoutSessionSubscription(user: User, plan: Plan) {
    console.log(
      '\n\n [Func] createCheckoutSessionSubscription for user',
      user.id,
      'planId',
      plan.planId,
    );

    const planId = plan.planId;
    let customer = await this.prisma.billingInfo.findFirst({
      where: { userId: user.id },
    });
    if (!customer) {
      await this.createCustomer(user.id);
      customer = await this.prisma.billingInfo.findFirst({
        where: { userId: user.id },
      });
      if (!customer) throw new BadRequestException('Failed to create customer');
    }

    try {
      const oldCustomer = await this.stripe.customers.retrieve(
        customer.stripeCustomerId as string,
      );
      if (!oldCustomer || oldCustomer.deleted) {
        await this.createCustomer(user.id);
        customer = await this.prisma.billingInfo.findFirst({
          where: { userId: user.id },
        });
        if (!customer)
          throw new BadRequestException('Failed to create customer');
      }
    } catch {
      await this.createCustomer(user.id);
      customer = await this.prisma.billingInfo.findFirst({
        where: { userId: user.id },
      });
      if (!customer) throw new BadRequestException('Failed to create customer');
    }
    console.log('15.15.15 Update Sub');

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        userId: user.id,
        status: EnumSubscriptionStatus.PENDING,
      },
      select: { id: true },
    });

    const subscriptionIds = subscriptions.map((s) => s.id);

    await this.prisma.subscription.updateMany({
      where: { id: { in: subscriptionIds } },
      data: { status: EnumSubscriptionStatus.EXPIRED },
    });

    await this.prisma.order.updateMany({
      where: { subscriptionId: { in: subscriptionIds } },
      data: { status: EnumOrderStatus.EXPIRED },
    });

    const activeSub = await this.prisma.subscription.findFirst({
      where: { userId: user.id, status: EnumSubscriptionStatus.ACTIVE },
    });
    if (activeSub && activeSub.planId == planId) {
      throw new BadRequestException('Already have subscription');
    }

    const subscriptionSettings = await this.prisma.plan.findUnique({
      where: { planId },
    });

    if (!subscriptionSettings)
      throw new BadRequestException(
        `There is no subscription with id ${planId}`,
      );

    if (planId == 'FREE') {
      const orderAndSub =
        await this.subscriptionService.createSubscriptionAndOrder(
          {
            userId: user.id,
            planId,
            storeLimit: subscriptionSettings.storeLimit!,
            productLimit: subscriptionSettings.productLimit!,
            status: EnumSubscriptionStatus.ACTIVE,
            customerId: customer.stripeCustomerId as string,
            createdAt: new Date(),
            period: subscriptionSettings.period,
          },
          user,
          plan,
          PaymentProvider.STRIPE,
        );
      const freeSub = orderAndSub.subscription;
      console.log('111 CREATE NEW SUB = ', freeSub);

      return `${process.env.CLIENT_URL}/billing?success=true&planId=${planId}`;
    }

    const date = new Date();
    const nextBillingDate = new Date(
      new Date(date).setMonth(
        date.getMonth() +
          (subscriptionSettings.period === BillingPeriod.MONTHLY ? 1 : 12),
      ),
    );

    const orderAndSub =
      await this.subscriptionService.createSubscriptionAndOrder(
        {
          userId: user.id,
          planId,
          storeLimit: subscriptionSettings.storeLimit!,
          productLimit: subscriptionSettings.productLimit!,
          status: EnumSubscriptionStatus.PENDING,
          customerId: customer.stripeCustomerId as string,
          createdAt: new Date(),
          nextBillingDate,
          period: subscriptionSettings.period,
        },
        user,
        plan,
        PaymentProvider.STRIPE,
      );
    const subscription = orderAndSub.subscription as Subscription;
    console.log('222 CREATE NEW SUB = ', subscription);
    const previousSub =
      (await this.prisma.subscription.count({
        where: {
          userId: user.id,
          status: EnumSubscriptionStatus.CANCELLED,
          planId: { not: 'FREE' },
        },
      })) > 0;

    const subscription_data =
      (activeSub && activeSub.planId !== 'FREE') || previousSub
        ? null
        : {
            trial_period_days: 7,
            metadata: {
              userId: user.id,
              planId,
              orderId: orderAndSub.order.id,
            },
          };
    const existUser = await this.userService.getById(user.id);
    const email = existUser?.email || null;
    if (email) {
      await this.stripe.customers.update(customer.stripeCustomerId as string, {
        email,
      });
    }

    console.log('\n\n subscriptionSettings = ', subscriptionSettings);
    const checkoutSessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product: subscriptionSettings.stripeProductId,
            recurring: {
              interval:
                subscriptionSettings.period === BillingPeriod.MONTHLY
                  ? 'month'
                  : 'year',
              interval_count: 1,
            },
            unit_amount: (subscriptionSettings.price || 0) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      payment_method_types: ['card'],
      // customer_email: user.email,
      saved_payment_method_options: {
        payment_method_save: 'enabled',
        allow_redisplay_filters: ['always'],
      },
      client_reference_id: `${subscription.id}`,
      allow_promotion_codes: true,
      success_url: `${process.env.CLIENT_URL}/billing?success=true&planId=${planId}`,
      cancel_url: `${process.env.CLIENT_URL}/billing?success=false&planId=${planId}`,
      customer: customer.stripeCustomerId as string,
      metadata: {
        userId: user.id,
        planId,
        orderId: orderAndSub.order.id,
      },
    };

    if (subscription_data) {
      checkoutSessionParams.subscription_data = subscription_data;
    }
    const session = await this.stripe.checkout.sessions.create(
      checkoutSessionParams,
    );
    return session.url as string;
  }

  /**
   * Сгенерировать login link в Stripe Dashboard продавца
   */
  async createLoginLink(user: User) {
    if (!user.stripeAccountId) {
      return {
        loginLink: null,
        error: 'User does not have stripe connected account',
      };
    }
    const loginLink = await this.stripe.accounts.createLoginLink(
      user.stripeAccountId,
    );
    return { loginLink: loginLink.url };
  }

  /**
   * Проверка статуса аккаунта продавца
   */
  async getAccountStatus(accountId: string) {
    return await this.stripe.accounts.retrieve(accountId);
  }

  /**
   * Создаёт подключённый аккаунт продавца
   */
  async createConnectedAccount(email: string) {
    const account = await this.stripe.accounts.create({
      type: 'express',
      // country: 'US',
      email,
      capabilities: { transfers: { requested: true } },
    });

    return account;
  }

  async createStripeTransfer(
    amount: number,
    destinationAccountId: string,
    sourceTransfer: string,
    idempotencyKey: string,
  ) {
    const transfer = await this.stripe.transfers.create(
      {
        amount: amount,
        currency: 'usd',
        destination: destinationAccountId,
        ...(sourceTransfer && { source_transaction: sourceTransfer }),
      },
      {
        idempotencyKey:
          idempotencyKey ||
          `transfer-${sourceTransfer}-${destinationAccountId}`,
      },
    );
    return transfer;
  }

  /**
   * Генерация ссылки для онбординга продавца
   */
  async createAccountLink(accountId: string) {
    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      type: 'account_onboarding',
      refresh_url: `${process.env.CLIENT_URL}/onboarding/refresh`,
      return_url: `${process.env.CLIENT_URL}/onboarding/success`,
    });

    return { accountLink: accountLink.url };
  }

  async createConnectAccountStripe(user: User) {
    let createdAccountId: string = user.stripeAccountId || '';
    console.log('\n\n [Func] createConnectAccountStripe for user', user);
    if (!user.stripeAccountId) {
      const createdAccount = await this.createConnectedAccount(user.email);
      createdAccountId = createdAccount.id;
      await this.prisma.user.update({
        where: { id: user.id },
        data: { stripeAccountId: createdAccountId },
      });
    }

    const account = await this.getAccountStatus(createdAccountId);

    const isReady =
      account.details_submitted &&
      account.payouts_enabled &&
      account.charges_enabled;

    const accountLinkObj = isReady
      ? { accountLink: null }
      : await this.createAccountLink(createdAccountId);

    return { ...accountLinkObj, isReady };

    // const accountLink = await this.createAccountLink(createdAccountId);
    // return accountLink;
  }

  async pay(dto: OrderDto, userId: string) {
    const items = dto.orderItems;

    if (!items || !items.length) {
      throw new BadRequestException('No items in order');
    }
    const order = await this.orderService.createOrder(dto, userId);

    const productIds = items.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        title: true,
        description: true,
        images: true,
        price: true,
        quantity: true,
      },
    });

    const productMap = validateOrderItemsAvailability(items, products);

    const lineItems = items.map((item) => {
      const product = productMap.get(item.productId)!;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            description: product.description || '',
            images: product.images?.length ? product.images : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
        userId,
        orderId: order!.id,
      },
      expires_at: Math.floor(Date.now() / 1000) + 60, // 1 hour
    });

    await this.prisma.order.update({
      where: { id: order!.id },
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id,
      },
    });

    return { url: session.url };
  }

  // async distributeFundsForOrder(orderId: string) {
  //   const order = await this.prisma.order.findUnique({
  //     where: { id: orderId },
  //     include: { orderItems: { include: { product: true } } },
  //   });

  //   if (!order) throw new NotFoundException('Order not found');

  //   // group by seller
  //   const bySeller = new Map<
  //     string,
  //     { amount: number; orderItemsIds: string[] }
  //   >();

  //   let isEmpty = true;
  //   for (const item of order.orderItems) {
  //     if (item.status !== EnumOrderItemStatus.CONFIRMED) {
  //       isEmpty = false;
  //       const amount = Math.round(item.price * item.quantity * 100);
  //       const sellerId = item.product?.userId as string;

  //       if (!bySeller.has(sellerId)) {
  //         bySeller.set(sellerId, { amount: 0, orderItemsIds: [] });
  //       }

  //       const entry = bySeller.get(sellerId)!;
  //       entry.amount += amount;
  //       entry.orderItemsIds.push(item.id);
  //     }
  //   }

  //   if (isEmpty) {
  //     throw new BadRequestException(
  //       'All customers has already received money for this order',
  //     );
  //   }

  //   // send money to customers

  //   for (const [sellerId, { amount, orderItemsIds }] of bySeller.entries()) {
  //     const seller = await this.prisma.user.findUnique({
  //       where: { id: sellerId },
  //     });

  //     if (!seller?.stripeAccountId) continue;

  //     const transferAmount = Math.round(amount * 0.95);

  //     const idempotencyKey = `orderItemsId-${orderItemsIds}`;
  //     const transfer = await this.createStripeTransfer(
  //       transferAmount,
  //       seller.stripeAccountId,
  //       order.stripeChargeId as string,
  //       idempotencyKey,
  //     );
  //     console.log('CREATED TRANSFER = ', transfer);

  //     // save transferId inside orderItems for that seller
  //     await this.prisma.orderItem.updateMany({
  //       where: { id: { in: orderItemsIds } },
  //       data: {
  //         stripeTransferId: transfer.id,
  //         status: EnumOrderItemStatus.CONFIRMED,
  //       },
  //     });
  //   }
  // }

  // async distributeFundsForOrderItem(orderItemId: string) {
  //   const orderItem = await this.prisma.orderItem.findUnique({
  //     where: { id: orderItemId },
  //     include: {
  //       product: true,
  //       order: true,
  //     },
  //   });

  //   if (!orderItem) throw new NotFoundException('Order item not found');
  //   if (orderItem.status === EnumOrderItemStatus.CONFIRMED)
  //     throw new NotFoundException(
  //       'The customer has already received money for this order',
  //     );
  //   if (!orderItem.product) throw new NotFoundException('Product not found');

  //   const sellerId = orderItem.product.userId;
  //   if (!sellerId) throw new NotFoundException('Seller not found');

  //   const seller = await this.prisma.user.findUnique({
  //     where: { id: sellerId },
  //   });

  //   if (!seller?.stripeAccountId) {
  //     // No Stripe account — skip silently or throw
  //     throw new BadRequestException(
  //       `Customer (ID: ${sellerId}) does not have stripe connected account.`,
  //     );
  //   }

  //   // calculate amount in cents
  //   const gross = Math.round(orderItem.price * orderItem.quantity * 100);
  //   const transferAmount = Math.round(gross * 0.95); // 95% payout
  //   const idempotencyKey = `orderItemId-${orderItemId}`;

  //   const transfer = await this.createStripeTransfer(
  //     transferAmount,
  //     seller.stripeAccountId,
  //     orderItem?.order?.stripeChargeId as string,
  //     idempotencyKey,
  //   );
  //   console.log('CREATED TRANSFER = ', transfer);

  //   // save transferId inside orderItems for that seller
  //   await this.prisma.orderItem.update({
  //     where: { id: orderItemId },
  //     data: {
  //       stripeTransferId: transfer.id,
  //       status: EnumOrderItemStatus.CONFIRMED,
  //     },
  //   });
  // }

  async distributeFundsForOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: { product: { include: { user: true } } },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== EnumOrderStatus.SUCCEEDED) {
      throw new NotFoundException('Order payment not succeeded.');
    }

    if (!order.stripeChargeId) {
      throw new BadRequestException(
        `Order - ${order.id} does not have a Stripe charge`,
      );
    }

    const itemsToPay = order.orderItems.filter(
      (item) => item.status !== EnumOrderItemStatus.CONFIRMED,
    );

    if (itemsToPay.length === 0) {
      throw new BadRequestException(
        'All customers have already received money for this order',
      );
    }

    const results: {
      orderItemId: string;
      sellerId: string;
      transferId?: string;
      amount?: number;
      success: boolean;
      error?: string;
    }[] = [];

    for (const item of itemsToPay) {
      try {
        const result = await this.distributeFundsForOrderItem(item.id);

        console.log(
          `[Order ${orderId}], OrderItem ${item.id} transfer processed successfully`,
        );

        results.push({
          orderItemId: item.id,
          sellerId: result.seller.id as string,
          transferId: result.transferId,
          amount: result.amount,
          success: true,
        });
      } catch (error) {
        console.error(
          `[Order ${orderId}] Failed to process transfer for orderItem ${item.id}:`,
          error.message,
        );

        results.push({
          orderItemId: item.id,
          sellerId: item.product?.userId || 'unknown',
          success: false,
          error: error.message,
        });
      }
    }

    const summary = {
      orderId,
      totalItems: itemsToPay.length,
      successfulTransfers: results.filter((r) => r.success).length,
      failedTransfers: results.filter((r) => !r.success).length,
      totalAmount: results
        .filter((r) => r.success)
        .reduce((sum, r) => sum + (r.amount || 0), 0),
      results,
      timestamp: new Date(),
    };

    console.log(`[Order ${orderId}] Distribution complete:`, {
      successful: summary.successfulTransfers,
      failed: summary.failedTransfers,
    });

    if (summary.failedTransfers > 0) {
      console.error(`[Order ${orderId}] Some transfers failed:`, summary);
    }
    if (summary.failedTransfers === 0) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: EnumOrderStatus.CONFIRMED },
      });
    }
    return summary;
  }

  async distributeFundsForOrderItem(orderItemId: string) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        product: { include: { user: true } },
        order: true,
      },
    });

    if (!orderItem) throw new NotFoundException(`Order item not found`);
    if (orderItem.order?.status !== EnumOrderStatus.SUCCEEDED) {
      throw new NotFoundException(`Order item payment not succeeded.`);
    }

    if (!orderItem.product) {
      throw new NotFoundException(
        `Order item ${orderItem.id} product not found`,
      );
    }

    if (orderItem.status === EnumOrderItemStatus.CONFIRMED) {
      throw new BadRequestException(
        `The customer has already received money for order item - ${orderItem.id}`,
      );
    }

    const sellerId = orderItem.product.userId;
    const seller = orderItem.product.user;

    if (!seller?.stripeAccountId) {
      throw new BadRequestException(
        `Seller (ID: ${sellerId}) does not have a connected Stripe account`,
      );
    }

    if (!orderItem.order?.stripeChargeId) {
      throw new BadRequestException(
        'Order does not have a Stripe charge associated',
      );
    }

    try {
      const gross = Math.round(orderItem.price * orderItem.quantity * 100);
      const transferAmount = Math.round(gross * 0.95);
      const commission = gross - transferAmount;

      const idempotencyKey = `order-item-${orderItemId}`;

      const transfer = await this.createStripeTransfer(
        transferAmount,
        seller.stripeAccountId,
        orderItem.order.stripeChargeId,
        idempotencyKey,
      );

      console.log(`Transfer created successfully:`, transfer);

      const updatedOrderItem = await this.prisma.orderItem.update({
        where: { id: orderItemId },
        data: {
          stripeTransferId: transfer.id,
          status: EnumOrderItemStatus.CONFIRMED,
        },
      });

      const transferLog = await this.prisma.transferLog.create({
        data: {
          // Relations
          orderId: orderItem.orderId!,
          orderItemId: orderItemId,
          sellerId: sellerId!,

          // Stripe IDs
          stripeTransferId: transfer.id,
          // stripeReversalId: null (будет заполнено при refund)
          // stripeRefundId: null (будет заполнено при refund)

          // price in cents
          grossAmount: gross,
          transferAmount: transferAmount,
          commission: commission,

          // status
          status: 'SUCCEEDED',
          errorMessage: null,

          // additional info
          reason: null, // Fill if refund
          metadata: {
            productTitle: orderItem.cachedProductTitle,
            productId: orderItem.productId,
            quantity: orderItem.quantity,
            price: orderItem.price,
          },
        },
      });

      return {
        success: true,
        transferId: transfer.id,
        amount: transferAmount / 100,
        seller: {
          id: sellerId,
          name: seller.name,
          email: seller.email,
        },
      };
    } catch (error) {
      console.error(
        `Failed to distribute funds for orderItem ${orderItemId}:`,
        error,
      );
      try {
        await this.prisma.transferLog.create({
          data: {
            // Relations
            orderId: orderItem.orderId as string,
            orderItemId: orderItemId,
            sellerId: sellerId as string,

            // Stripe IDs (нет, т.к. трансфер не создался)
            stripeTransferId: null,
            errorMessage: error.message,

            // Суммы
            grossAmount: Math.round(orderItem.price * orderItem.quantity * 100),
            transferAmount: 0,
            commission: 0,

            // Статус
            status: 'FAILED',

            // Дополнительно
            metadata: {
              productTitle: orderItem.product?.title,
              errorStack: error.stack,
            },
          },
        });
      } catch (logError) {
        console.error(
          `[OrderItem ${orderItemId}] Failed to create TransferLog:`,
          logError.message,
        );
      }

      throw new BadRequestException(
        `Failed to distribute funds: ${error.message}`,
      );
    }
  }

  async payOneItem(dto: OrderDto, userId: string, order: Order) {
    const items = dto.orderItems;
    if (items.length > 1) {
      throw new BadRequestException('Only one item allowed per order');
    }
    const bySeller = new Map<string, typeof items>();

    for (const item of items) {
      const productOwner = await this.prisma.user.findUnique({
        where: { id: item.userId },
      });
      if (!productOwner || !productOwner.stripeAccountId) {
        throw new BadRequestException(
          'Product owner not found or has no Stripe account',
        );
      }

      const acc = await this.stripe.accounts.retrieve(
        productOwner.stripeAccountId,
      );
      if (!acc.capabilities || acc.capabilities.transfers !== 'active') {
        throw new BadRequestException('Seller Stripe account not active');
      }
      console.log('acc ', acc.capabilities);

      if (!bySeller.has(productOwner.stripeAccountId)) {
        bySeller.set(productOwner.stripeAccountId, []);
      }
      const sellerItems = bySeller.get(productOwner.stripeAccountId) || [];
      sellerItems.push(item);
      bySeller.set(productOwner.stripeAccountId, sellerItems);
    }

    // создаём отдельную checkout-сессию для каждого продавца
    const sessions: { sellerStripeId: string; url: string | null }[] = [];
    for (const [sellerStripeId, sellerItems] of bySeller.entries()) {
      const lineItems = sellerItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name || '',
            description: item.description || '',
            // images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/payment/success`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
        payment_intent_data: {
          application_fee_amount: Math.round(
            0.05 *
              sellerItems.reduce((sum, i) => sum + i.price * i.quantity, 0) *
              100,
          ),
          transfer_data: {
            destination: sellerStripeId,
          },
        },
        metadata: {
          userId,
          orderId: order.id,
        },
      });

      sessions.push({ sellerStripeId, url: session.url });
    }

    return sessions[0];
  }

  // public async handleWebhook(
  //   event: Stripe.Event,
  // ): Promise<PaymentWebhookResult | null> {
  public async handleWebhook(event: Stripe.Event) {
    console.log('\n\n\n ++++ handleWebhook EVENT TYPE = ', event.type);
    switch (event.type) {
      case 'payment_method.attached':
        this.onPaymentMethodAttached(event);
        break;
      case 'customer.subscription.updated':
        this.onSubscriptionUpdated(event);
        break;
      case 'checkout.session.completed':
        this.onCheckoutSessionCompleted(event);
        break;
      case 'checkout.session.expired':
        this.onCheckoutSessionExpired(event);
        break;
      case 'invoice.payment_succeeded':
        this.onInvoicePaymentSucceeded(event);
        break;
      case 'customer.subscription.deleted':
        this.onCustomerSubscriptionDeleted(event);
        break;
      case 'customer.subscription.paused':
        this.onCustomerSubscriptionPaused(event);
        break;
      case 'customer.subscription.resumed':
        this.onCustomerSubscriptionResumed(event);
        break;
      case 'invoice.payment_failed':
        this.onInvoicePaymentFailed(event);
        break;
      case 'balance.available':
        this.onBalanceAvailable(event);
        break;
      case 'transfer.created':
        this.onTransferCreated(event);
        break;
      // case 'payment.created':
      //   this.onPaymentCreated(event);
      //   break;
      default:
        throw new BadRequestException(`Unknown event type: ${event.type}`);
    }
    // TODO: implement handling different event types
    // switch (event.type) {
    //   case 'checkout.session.completed': {
    //     const paymentObject = event.data.object as Stripe.Checkout.Session;

    //     const orderId = paymentObject.metadata?.orderId;
    //     const planId = paymentObject.metadata?.planId;
    //     const paymentId = paymentObject.id;

    //     if (!orderId || !planId || !paymentId) {
    //       return null;
    //     }
    //     return {
    //       orderId: orderId,
    //       planId,
    //       paymentId,
    //       status: EnumOrderStatus.SUCCEEDED,
    //       raw: event,
    //     };
    //   }
    //   case 'invoice.payment_failed': {
    //     const invoice = event.data.object as Stripe.Invoice;

    //     const orderId = invoice.metadata?.orderId;
    //     const planId = invoice.metadata?.planId;
    //     const paymentId = invoice.id;

    //     if (!orderId || !planId || !paymentId) {
    //       return null;
    //     }
    //     return {
    //       orderId: orderId,
    //       planId,
    //       paymentId,
    //       status: EnumOrderStatus.FAILED,
    //       raw: event,
    //     };
    //   }
    //   default:
    //     return null;
    // }
  }
  constructEvent(request: Request): { error?: Error; event?: Stripe.Event } {
    const sig = request.headers['stripe-signature'];
    try {
      const event = this.stripe.webhooks.constructEvent(
        request.body as Buffer,
        sig as string,
        this.configService.get<string>(
          EnvVariables.STRIPE_WEBHOOK_SECRET,
        ) as string,
      );
      return { event };
    } catch (err) {
      return { error: err as Error };
    }
  }

  async onSubscriptionUpdated(event: Stripe.CustomerSubscriptionUpdatedEvent) {
    console.log('\n\n [Func] WEBHOOK onSubscriptionUpdated event ', event);
    const session = event.data.object;
    let sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: session.id },
      include: { order: true },
    });
    if (!sub) {
      console.log('[customer.subscription.updated] No subscription found');
      sub = await this.prisma.subscription.findFirst({
        where: {
          customerId: session.customer as string,
          status: EnumSubscriptionStatus.ACTIVE,
        },
        include: { order: true },
      });
      if (!sub) {
        return;
      }
    }
    const subUpdateData: any = {};
    console.log('\n\n event.data.object = ', event.data.object);
    if (event.data.object.cancel_at_period_end || event.data.object.cancel_at) {
      subUpdateData.cancelledAt = new Date(
        (event?.data?.object?.cancel_at || Date.now()) * 1000,
      );
      subUpdateData.cancelledReason = event.data.object.cancellation_details;
      subUpdateData.nextPlanId = sub.nextPlanId || EnumSubscriptionType.FREE;
    } else if (sub.cancelledAt) {
      subUpdateData.status = EnumSubscriptionStatus.ACTIVE;
      subUpdateData.cancelledAt = null;
      subUpdateData.cancelledReason = null;
      subUpdateData.nextPlanId = null;
    }

    if (event.data.object.status === 'trialing') {
      subUpdateData.trialEndAt = new Date(
        (event?.data?.object?.trial_end || Date.now()) * 1000,
      );
    } else if (event.data.object.status === 'active') {
      subUpdateData.trialEndAt = null;
    }
    console.log('111 Update Sub');
    await this.prisma.subscription.update({
      where: { id: sub.id },
      data: subUpdateData,
    });
  }

  async onCheckoutSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent,
  ) {
    const session = event.data.object;
    if (session?.metadata?.planId) {
      this.onCheckoutSessionCompletedSubscription(event);
      return;
    }
    this.onCheckoutSessionCompletedProduct(event);
    return;
  }

  async onCheckoutSessionExpired(event: Stripe.CheckoutSessionExpiredEvent) {
    console.log('\n\n [Func] WEBHOOK onCheckoutSessionExpired event = ', event);
    const session = event.data.object as Stripe.Checkout.Session;

    await this.prisma.order.update({
      where: { id: session?.metadata?.orderId },
      data: { status: EnumOrderStatus.EXPIRED },
    });
    return;
  }

  async onCheckoutSessionCompletedProduct(
    event: Stripe.CheckoutSessionCompletedEvent,
  ) {
    console.log(
      '\n\n [Func] WEBHOOK onCheckoutSessionCompleted event = ',
      event,
    );
    const session = event.data.object;
    console.log('\n onCheckoutSessionCompletedProduct - session = ', session);
    const { userId, orderId } = session.metadata as {
      userId: string;
      orderId: string;
    };

    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException(
        'onCheckoutSessionCompletedProduct User not found',
      );
    }

    if (!orderId) {
      throw new NotFoundException(
        'onCheckoutSessionCompletedProduct Order not found',
      );
    }

    if (user && !user.email) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { email: session.customer_details?.email as string },
      });
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      session.payment_intent as string,
      // { expand: ['latest_charge'] },
    );
    console.log('\n\n paymentIntent = ', paymentIntent);
    const chargeId = paymentIntent.latest_charge as string;

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: EnumOrderStatus.SUCCEEDED,
        stripePaymentIntentId: session.payment_intent as string,
        stripeChargeId: chargeId as string,
      },
    });
  }

  async onCheckoutSessionCompletedSubscription(
    event: Stripe.CheckoutSessionCompletedEvent,
  ) {
    console.log(
      '\n\n [Func] WEBHOOK onCheckoutSessionCompleted event = ',
      event,
    );
    const session = event.data.object;
    console.log('\nsession.metadata = ', session.metadata);
    const { userId, planId } = session.metadata as {
      userId: string;
      orderId: string;
      planId: EnumSubscriptionType;
    };

    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException('onCheckoutSessionCompleted User not found');
    }
    const plan = await this.prisma.plan.findUnique({
      where: { planId },
    });
    if (!plan) {
      throw new NotFoundException('onCheckoutSessionCompleted Plan not found');
    }

    if (user && !user.email) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { email: session.customer_details?.email as string },
      });
    }

    const oldSub = await this.prisma.subscription.findFirst({
      where: { userId, status: EnumSubscriptionStatus.ACTIVE },
      include: { order: true },
    });
    if (oldSub) {
      if (oldSub.planId === EnumSubscriptionType.FREE) {
        console.log('222 Update Sub');
        await this.subscriptionService.updateSubscriptionAndOrder(
          { status: EnumSubscriptionStatus.CANCELLED },
          oldSub?.order?.id as string,
          { status: EnumOrderStatus.CANCELLED },
        );
      } else {
        try {
          await this.stripe.subscriptions.cancel(
            oldSub.stripeSubscriptionId as string,
          );
        } catch (err) {
          console.log(
            `StripeService.onCheckoutSessionCompleted() : failed: ${err}`,
          );
        }
      }
    }

    let sub;
    if (userId && planId) {
      sub = await this.prisma.subscription.findFirst({
        where: { userId, status: EnumSubscriptionStatus.PENDING, planId },
        include: { order: true },
      });
      if (!sub) {
        sub = await this.prisma.subscription.findFirst({
          where: { userId, status: EnumSubscriptionStatus.ACTIVE, planId },
          include: { order: true },
        });
        if (sub) return;

        const subscriptionSettings = await this.prisma.plan.findUnique({
          where: { planId },
        });

        if (!subscriptionSettings)
          throw new BadRequestException(
            `There is no subscription with id ${planId}`,
          );
        const stripeSubscription = await this.stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        const nextBillingDate =
          this.calculateNextBillingDate(stripeSubscription) || undefined;
        const trialing = stripeSubscription.status === 'trialing';
        const subAndOrder =
          await this.subscriptionService.createSubscriptionAndOrder(
            {
              userId,
              status: EnumSubscriptionStatus.ACTIVE,
              planId: planId,
              storeLimit: subscriptionSettings.storeLimit!,
              productLimit: subscriptionSettings.productLimit!,
              period: subscriptionSettings.period,
              customerId: session.customer as string,
              createdAt: new Date(),
              nextBillingDate,
              stripeSubscriptionId: session.subscription as string,
              trialEndAt: trialing ? nextBillingDate : undefined,
            },
            user,
            plan,
            PaymentProvider.STRIPE,
          );
        sub = {
          ...(subAndOrder.subscription as Subscription),
          order: subAndOrder.order,
        };
        console.log('333 CREATE NEW SUB = ', sub);
        return;
      }
    } else {
      sub = await this.prisma.subscription.findFirst({
        where: {
          customerId: session.customer as string,
          status: EnumSubscriptionStatus.PENDING,
        },
        include: { order: true },
      });
      if (!sub) {
        const customer = await this.prisma.billingInfo.findUnique({
          where: { userId },
        });
        if (!customer) {
          throw new BadRequestException('Customer not found');
        }
        sub = await this.prisma.subscription.findFirst({
          where: { userId, status: EnumSubscriptionStatus.PENDING },
          include: { order: true },
        });
        if (!sub) {
          throw new BadRequestException('Subscription not found');
        }
      }
    }

    const subscriptionSettings = await this.prisma.plan.findUnique({
      where: { planId: sub.planId },
    });

    if (!subscriptionSettings)
      throw new BadRequestException(
        `There is no subscription with id ${sub.planId}`,
      );

    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    console.log('\n\n\n stripeSubscription', stripeSubscription);

    let nextBillingDate: Date;
    if (
      stripeSubscription.status === 'trialing' &&
      stripeSubscription.trial_end
    ) {
      nextBillingDate = new Date(stripeSubscription.trial_end * 1000);
    } else if ((stripeSubscription as any).current_period_end) {
      nextBillingDate = this.calculateNextBillingDate(
        stripeSubscription,
      ) as Date;
    } else {
      const date = new Date();
      nextBillingDate = new Date(
        new Date(date).setMonth(
          date.getMonth() +
            (subscriptionSettings.period === BillingPeriod.MONTHLY ? 1 : 12),
        ),
      );
    }
    console.log('333 Update Sub');

    await this.subscriptionService.updateSubscriptionAndOrder(
      {
        status: EnumSubscriptionStatus.ACTIVE,
        storeLimit: subscriptionSettings.storeLimit!,
        productLimit: subscriptionSettings.productLimit!,
        stripeSubscriptionId: session.subscription as string,
        nextBillingDate,
        trialEndAt:
          stripeSubscription.status === 'trialing'
            ? new Date((stripeSubscription as any).trial_end * 1000)
            : undefined,
      },
      sub.order.id as string,
      { status: EnumOrderStatus.SUCCEEDED },
    );
  }

  async onInvoicePaymentSucceeded(event: Stripe.InvoicePaymentSucceededEvent) {
    console.log(
      '\n\n [Func] WEBHOOK onInvoicePaymentSucceeded event = ',
      event,
    );
    const session = event.data.object;
    let sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: (session as any).subscription as string },
      include: { order: true },
    });
    if (!sub) {
      const { userId, planId } = (session as any).subscription_details
        .metadata as {
        userId: string;
        planId: EnumSubscriptionType;
      };
      sub = await this.prisma.subscription.findFirst({
        where: { userId, status: EnumSubscriptionStatus.PENDING, planId },
        include: { order: true },
      });
      if (!sub) {
        console.log(
          '[invoice.payment_succeeded] No subscription found. Waiting for checkout.session.completed',
        );
        return;
      }
    }

    const subscriptionSettings = await this.prisma.plan.findUnique({
      where: { planId: sub.planId },
    });

    if (!subscriptionSettings)
      throw new BadRequestException(
        `There is no subscription with id ${sub.planId}`,
      );

    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      (session as any).subscription as string,
    );

    console.log('stripeSubscription = ', stripeSubscription);
    console.log('444 Update Sub');
    const nextBillingDate =
      this.calculateNextBillingDate(stripeSubscription) || undefined;

    const subDto = {
      stripeSubscriptionId: (session as any).subscription as string,
      status: EnumSubscriptionStatus.ACTIVE,
      // nextBillingDate: new Date(
      //   (stripeSubscription as any).current_period_end * 1000,
      // ),
      nextBillingDate,
      ...(stripeSubscription.status === 'trialing'
        ? { trialEndAt: new Date((stripeSubscription as any).trial_end * 1000) }
        : {}),
    };
    const orderDto = {
      providerMeta: JSON.parse(JSON.stringify(event.data.object)),
      stripePaymentIntentId: (session as any).payment_intent as string,
      status: EnumOrderStatus.SUCCEEDED,
    };
    await this.subscriptionService.updateSubscriptionAndOrder(
      subDto,
      sub?.order?.id as string,
      orderDto,
    );
  }

  async onCustomerSubscriptionDeleted(
    event: Stripe.CustomerSubscriptionDeletedEvent,
  ) {
    console.log('\n[WEBHOOK] onCustomerSubscriptionDeleted', event);

    const session = event.data.object;
    let sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: session.id },
      include: { order: true },
    });
    if (!sub) {
      console.log('[customer.subscription.deleted] No subscription found');
      sub = await this.prisma.subscription.findFirst({
        where: {
          customerId: session.customer as string,
          status: EnumSubscriptionStatus.ACTIVE,
        },
        include: { order: true },
      });
      if (!sub) {
        return;
      }
    }
    console.log('sub = ', sub);
    if (sub.nextPlanId) {
      const plan = await this.prisma.plan.findUnique({
        where: { planId: sub.nextPlanId },
      });
      if (!plan)
        throw new BadRequestException(
          `There is no subscription with id ${sub.nextPlanId}`,
        );

      const user = await this.prisma.user.findUnique({
        where: { id: sub.userId },
      });

      try {
        const date = new Date();
        const nextBillingDate = new Date(
          new Date(date).setMonth(
            date.getMonth() + (plan.period === BillingPeriod.MONTHLY ? 1 : 12),
          ),
        );
        const customer = await this.prisma.billingInfo.findUnique({
          where: { userId: sub.userId },
        });

        console.log('444 CREATE NEW SUB');
        const subAndOrder =
          await this.subscriptionService.createSubscriptionAndOrder(
            {
              userId: sub.userId,
              status: EnumSubscriptionStatus.PENDING,
              planId: sub.nextPlanId,
              customerId: customer?.stripeCustomerId as string,
              createdAt: new Date(),
              nextBillingDate,
              period: plan.period,
              storeLimit: plan.storeLimit!,
              productLimit: plan.productLimit!,
            },
            user as User,
            plan,
            PaymentProvider.STRIPE,
          );
        const newSub = {
          ...(subAndOrder.subscription as Subscription),
          order: subAndOrder.order,
        };

        if (plan.planId == EnumSubscriptionType.FREE) {
          console.log('555 Update Sub');

          await this.subscriptionService.updateSubscriptionAndOrder(
            {
              status: EnumSubscriptionStatus.ACTIVE,
              storeLimit: plan.storeLimit!,
              productLimit: plan.productLimit!,
              nextBillingDate: undefined,
            },
            newSub.order.id as string,
            { status: EnumOrderStatus.SUCCEEDED },
          );

          console.log('666 Update Sub');

          await this.subscriptionService.updateSubscriptionAndOrder(
            {
              cancelledAt: new Date(),
              cancelledReason: JSON.parse(
                JSON.stringify(event.data.object.cancellation_details),
              ),
              status: EnumSubscriptionStatus.CANCELLED,
            },
            sub?.order?.id as string,
            { status: EnumOrderStatus.SUCCEEDED },
          );
          return;
        }

        try {
          console.log('444 111 CREATE NEW SUB');

          const subscription = await this.stripe.subscriptions.create({
            customer: customer?.stripeCustomerId as string,
            // test_clock: customer?.stripeTestClockId || undefined,
            items: [
              {
                price_data: {
                  currency: 'USD',
                  product: plan.stripeProductId,
                  recurring: {
                    interval:
                      plan.period === BillingPeriod.MONTHLY ? 'month' : 'year',
                    interval_count: 1,
                  },
                  unit_amount: plan.price || 0,
                },
              },
            ],
            payment_settings: {
              save_default_payment_method: 'on_subscription',
            },
            default_payment_method:
              customer?.stripeDefaultPaymentMethod as string,
          });

          console.log('777 Update Sub');
          await this.subscriptionService.updateSubscriptionAndOrder(
            {
              stripeSubscriptionId: subscription.id,
              nextBillingDate: this.calculateNextBillingDate(subscription),
              status:
                subscription.status === 'active'
                  ? EnumSubscriptionStatus.ACTIVE
                  : newSub.status,
            },
            newSub.order.id as string,
            { status: EnumOrderStatus.SUCCEEDED },
          );
        } catch (err) {
          console.log('ERR = ', err);
          const freePlan = await this.prisma.plan.findUnique({
            where: { planId: EnumSubscriptionType.FREE },
          });
          console.log('888 Update Sub');

          await this.subscriptionService.updateSubscriptionAndOrder(
            {
              planId: EnumSubscriptionType.FREE,
              status: EnumSubscriptionStatus.ACTIVE,
              nextBillingDate: undefined,
              storeLimit: freePlan?.storeLimit!,
              productLimit: freePlan?.productLimit!,
            },
            newSub.order.id as string,
            { status: EnumOrderStatus.SUCCEEDED },
          );
        }
      } catch (err) {
        console.log(
          `StripeService.onCustomerSubscriptionDeleted() : failed: ${err}`,
        );
      }
    }
    console.log('999 Update Sub');

    await this.subscriptionService.updateSubscriptionAndOrder(
      {
        cancelledAt: new Date(),
        cancelledReason: JSON.parse(
          JSON.stringify(event.data.object.cancellation_details),
        ),
        status: EnumSubscriptionStatus.CANCELLED,
      },
      sub?.order?.id as string,
      { status: EnumOrderStatus.CANCELLED },
    );

    const newSub = await this.prisma.subscription.findFirst({
      where: {
        userId: sub.userId,
        status: {
          in: [EnumSubscriptionStatus.ACTIVE, EnumSubscriptionStatus.PENDING],
        },
      },
    });

    if (!newSub) {
      const customer = await this.prisma.billingInfo.findUnique({
        where: { userId: sub.userId },
      });
      const subscriptionSettings = await this.prisma.plan.findUnique({
        where: { planId: EnumSubscriptionType.FREE },
      });
      if (!subscriptionSettings)
        throw new BadRequestException('There is no subscription with id free');

      const plan = await this.prisma.plan.findUnique({
        where: { planId: EnumSubscriptionType.FREE },
      });
      const user = await this.prisma.user.findUnique({
        where: { id: sub.userId },
      });
      console.log('444 CREATE NEW SUB');
      const newFreeSubAndOrder =
        await this.subscriptionService.createSubscriptionAndOrder(
          {
            userId: sub.userId,
            status: EnumSubscriptionStatus.ACTIVE,
            planId: EnumSubscriptionType.FREE,
            storeLimit: subscriptionSettings.storeLimit!,
            productLimit: subscriptionSettings.productLimit!,
            period: subscriptionSettings.period,
            customerId: customer?.stripeCustomerId as string,
            createdAt: new Date(),
          },
          user as User,
          plan as Plan,
          PaymentProvider.STRIPE,
        );
      const newFreeSub = newFreeSubAndOrder.subscription;
      console.log('555 CREATE NEW SUB = ', newFreeSub);
    }
  }

  async onCustomerSubscriptionPaused(
    event: Stripe.CustomerSubscriptionPausedEvent,
  ) {
    console.log(
      '\n\n [Func] WEBHOOK onCustomerSubscriptionPaused event = ',
      event,
    );
    const session = event.data.object;
    const sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: session.id },
      include: { order: true },
    });
    if (!sub) {
      console.log('[customer.subscription.paused] No subscription found');
      return;
    }

    console.log('101010 Update Sub');
    await this.subscriptionService.updateSubscriptionAndOrder(
      {
        status: EnumSubscriptionStatus.PAUSED,
        pausedAt: new Date(),
      },
      sub?.order?.id as string,
      { status: EnumOrderStatus.PAUSED },
    );
  }

  async onCustomerSubscriptionResumed(
    event: Stripe.CustomerSubscriptionResumedEvent,
  ) {
    console.log(
      '\n\n [Func] WEBHOOK onCustomerSubscriptionResumed event = ',
      event,
    );
    const session = event.data.object;
    const sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: session.id },
      include: { order: true },
    });
    if (!sub) {
      console.log('[customer.subscription.resumed] No subscription found');
      return;
    }
    const date = new Date();
    const nextBillingDate =
      sub.nextBillingDate && sub.pausedAt
        ? new Date(
            sub.nextBillingDate.getTime() +
              (date.getTime() - sub.pausedAt.getTime()),
          )
        : undefined;
    console.log('11.11.11 Update Sub');

    await this.subscriptionService.updateSubscriptionAndOrder(
      {
        status: EnumSubscriptionStatus.ACTIVE,
        nextBillingDate: nextBillingDate,
        pausedAt: null,
      },
      sub?.order?.id as string,
      { status: EnumOrderStatus.SUCCEEDED },
    );
  }

  async onInvoicePaymentFailed(event: Stripe.InvoicePaymentFailedEvent) {
    console.log('\n\n [Func] WEBHOOK onInvoicePaymentFailed event = ', event);
    const session = event.data.object;
    if (!(session as any).subscription) return;

    const sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: (session as any).subscription as string },
      include: { order: true },
    });
    if (!sub) {
      console.log('[invoice.payment_failed] No subscription found');
      return;
    }
    console.log('12.12.12 Update Sub');

    await this.subscriptionService.updateSubscriptionAndOrder(
      {
        status: EnumSubscriptionStatus.OVERDUE,
      },
      sub?.order?.id as string,
      { status: EnumOrderStatus.FAILED },
    );
  }

  // TODO
  async onPaymentMethodAttached(event: Stripe.PaymentMethodAttachedEvent) {
    console.log('\n\n [Func] WEBHOOK onPaymentMethodAttached EVENT = ', event);
    const customer = await this.prisma.billingInfo.findFirst({
      where: {
        stripeCustomerId: (event?.data?.object?.customer as any)
          ?.customerId as string,
      },
    });
    if (!customer) {
      console.log('[payment_method.attached] No customer found');
      return;
    }
    await this.prisma.billingInfo.update({
      where: { id: customer.id },
      data: {
        stripeDefaultPaymentMethod: event.data.object.id,
      },
    });
  }

  async onBalanceAvailable(event: Stripe.BalanceAvailableEvent) {
    console.log('\n\n [Func] WEBHOOK onBalanceAvailable EVENT = ', event);
  }

  async onTransferCreated(event: Stripe.TransferCreatedEvent) {
    console.log('\n\n [Func] WEBHOOK onTransferCreated EVENT = ', event);
    // const transferObj = event.data.object;
    // const transferId = transferObj.id;

    // const orderItems = await this.prisma.orderItem.findMany({
    //   where: {
    //     stripeTransferId: transferId,
    //   },
    // });
    // if (!orderItems.length) return;

    // await this.prisma.orderItem.updateMany({
    //   where: { stripeTransferId: transferId },
    //   data: {
    //     status: EnumOrderItemStatus.TRANSFER_CREATED,
    //   },
    // });
  }

  async createInvoice(userId: string, planId: EnumSubscriptionType) {
    console.log('\n\n [Func] createInvoice');
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: EnumSubscriptionStatus.ACTIVE },
    });
    if (!sub) throw new BadRequestException('Subscription not found');
    const plan = await this.prisma.plan.findUnique({ where: { planId } });
    if (!plan)
      throw new BadRequestException(
        `There is no subscription with id ${planId}`,
      );

    const prod = await this.stripe.products.retrieve(plan.stripeProductId);

    const invoice = await this.stripe.paymentLinks.create({
      line_items: [
        {
          price: prod.default_price?.toString() || '',
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planId,
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.CLIENT_URL}/`,
        },
      },
    });
    return invoice.url;
  }

  async getAvailablePlans() {
    const model = this.prisma.plan.fields;
    const select = excludeFields(model, ['stripePriceId', 'stripeProductId']);

    return this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
      select,
    });
  }

  calculateNextBillingDate(subscription: Stripe.Subscription) {
    console.log('\n\n [Func] calculateNextBillingDate');
    const item = subscription.items?.data?.[0];
    const price = item?.price;

    if (!price?.recurring) {
      console.warn('No recurring price found');
      return undefined;
    }

    const start = subscription.billing_cycle_anchor * 1000;
    const interval = price.recurring.interval; // 'month' | 'year'
    const intervalCount = price.recurring.interval_count ?? 1;

    if (subscription.trial_end && subscription.status === 'trialing') {
      return new Date(subscription.trial_end * 1000);
    }
    const nextBillingDate = new Date(start);
    if (interval === 'month') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + intervalCount);
    } else if (interval === 'year') {
      nextBillingDate.setFullYear(
        nextBillingDate.getFullYear() + intervalCount,
      );
    }

    console.log('\n\n\n ***** nextBillingDate = ', nextBillingDate);
    return nextBillingDate;
  }

  async createStripeTestClock(name: string = 'Test Clock') {
    const clock = await this.stripe.testHelpers.testClocks.create({
      frozen_time: Math.floor(Date.now() / 1000),
      name: name,
    });
    return clock;
  }

  async simulateStripeTestClockAdvance(userId: string, numberOfDays: number) {
    const customer = await this.prisma.billingInfo.findUnique({
      where: { userId },
    });
    if (!customer || !customer.stripeTestClockId) {
      throw new BadRequestException('No test clock found for user');
    }
    await this.stripe.testHelpers.testClocks.advance(
      customer.stripeTestClockId,
      {
        frozen_time:
          Math.floor(Date.now() / 1000) + 60 * 60 * 24 * numberOfDays,
      },
    );
  }
}
