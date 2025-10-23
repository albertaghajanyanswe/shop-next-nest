import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BillingCycle,
  EnumSubscriptionStatus,
  EnumSubscriptionType,
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

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    this.stripe = new Stripe(
      configService.get<string>(EnvVariables.STRIPE_SECRET_KEY) as string,
      // {
      //   apiVersion: '2025-03-31.basil',
      // },
    );
  }

  async onModuleInit() {
    // Initialize subscription plans
    await this.initializeSubscriptionPlans();
  }

  private async createStripePrice(plan: Omit<Plan, 'id'>) {
    console.log('\n\n [Func] createStripePrice');
    const price = await this.stripe.prices.create({
      unit_amount: plan.price * 100,
      currency: 'usd',
      recurring: {
        interval: plan.period === BillingCycle.MONTHLY ? 'month' : 'year',
      },
      product: plan.stripeProductId,
    });
    return price;
  }

  async createStripeProduct(plan: Omit<Plan, 'id'>) {
    console.log('\n\n [Func] createStripeProduct');
    const stripeProduct = await this.stripe.products.create({
      name: `${plan.planId.split('_')[0]} ${plan.period} PLAN`,
      default_price_data: {
        currency: 'USD',
        unit_amount: plan.price || 0,
        recurring: {
          interval: plan.period === BillingCycle.MONTHLY ? 'month' : 'year',
          interval_count: 1,
        },
      },
    });
    return stripeProduct;
  }

  async createStripeProductAndPlan(plan: Plan) {
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

    const plans: Omit<Plan, 'id'>[] = [
      {
        planId: EnumSubscriptionType.FREE,
        period: BillingCycle.MONTHLY,
        storeLimit: 1,
        productLimit: 10,
        price: 0,
        stripeProductId: '',
        stripePriceId: '',
      },
      {
        planId: EnumSubscriptionType.ADVANCED,
        period: BillingCycle.MONTHLY,
        storeLimit: 5,
        productLimit: 150,
        price: 1,
        stripeProductId: '', // advanced.id,
        stripePriceId: '',
      },
      {
        planId: EnumSubscriptionType.ADVANCED_ANNUAL,
        period: BillingCycle.ANNUAL,
        storeLimit: 5,
        productLimit: 150,
        price: 1 * 10,
        stripeProductId: '', // advanced.id,
        stripePriceId: '',
      },
      {
        planId: EnumSubscriptionType.PREMIUM,
        period: BillingCycle.MONTHLY,
        storeLimit: -1,
        productLimit: -1,
        price: 2,
        stripeProductId: '', // premium.id,
        stripePriceId: '',
      },
      {
        planId: EnumSubscriptionType.PREMIUM_ANNUAL,
        period: BillingCycle.ANNUAL,
        storeLimit: -1,
        productLimit: -1,
        price: 2 * 10,
        stripeProductId: '', // premium.id,
        stripePriceId: '',
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

  async upgradeSubscription(
    userId: string,
    planId: EnumSubscriptionType,
  ): Promise<string> {
    try {
      console.log('\n\n [Func] upgradeSubscription', userId, planId);
      const sub = await this.prisma.subscription.findFirst({
        where: { userId, status: EnumSubscriptionStatus.ACTIVE },
      });
      console.log('Active sub = ', sub);
      if (!sub) throw new BadRequestException('Subscription not found');
      if (sub.planId == planId) {
        throw new BadRequestException('Already have subscription');
      }
      if (sub.nextPlanId) {
        if (sub.nextPlanId == planId) {
          throw new BadRequestException('Already have subscription');
        }
        await this.cancelUpgrade(userId);
      }
      const plan = await this.prisma.plan.findUnique({
        where: { planId },
      });
      if (!plan)
        throw new BadRequestException(
          `There is no subscription with id ${planId}`,
        );

      const oldPlan = await this.prisma.plan.findUnique({
        where: { planId: sub.planId },
      });

      if (plan.price > (oldPlan?.price || 0)) {
        const url = await this.createCheckoutSessionSubscription(
          userId,
          planId,
        );
        return url;
      } else {
        try {
          await this.stripe.subscriptions.update(
            sub.stripeSubscriptionId as string,
            {
              cancel_at_period_end: true,
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
          });

          await this.prisma.billingInfo.update({
            where: { id: localCustomer.id },
            data: {
              stripeCustomerId: newStripeCustomer.id,
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
          });

          await this.prisma.billingInfo.update({
            where: { id: localCustomer.id },
            data: {
              stripeCustomerId: newStripeCustomer.id,
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
        });
        await this.prisma.billingInfo.create({
          data: {
            userId: userId,
            serviceId: 'stripe',
            stripeCustomerId: newStripeCustomer.id,
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

  async createCheckoutSessionSubscription(
    userId: string,
    planId: EnumSubscriptionType,
  ) {
    console.log(
      '\n\n [Func] createCheckoutSessionSubscription for user',
      userId,
      'planId',
      planId,
    );
    let customer = await this.prisma.billingInfo.findFirst({
      where: { userId },
    });
    if (!customer) {
      await this.createCustomer(userId);
      customer = await this.prisma.billingInfo.findFirst({ where: { userId } });
      if (!customer) throw new BadRequestException('Failed to create customer');
    }

    try {
      const oldCustomer = await this.stripe.customers.retrieve(
        customer.stripeCustomerId as string,
      );
      if (!oldCustomer || oldCustomer.deleted) {
        await this.createCustomer(userId);
        customer = await this.prisma.billingInfo.findFirst({
          where: { userId },
        });
        if (!customer)
          throw new BadRequestException('Failed to create customer');
      }
    } catch {
      await this.createCustomer(userId);
      customer = await this.prisma.billingInfo.findFirst({ where: { userId } });
      if (!customer) throw new BadRequestException('Failed to create customer');
    }
    console.log('15.15.15 Update Sub');
    await this.prisma.subscription.updateMany({
      where: { userId, status: EnumSubscriptionStatus.PENDING },
      data: { status: EnumSubscriptionStatus.EXPIRED },
    });

    const activeSub = await this.prisma.subscription.findFirst({
      where: { userId, status: EnumSubscriptionStatus.ACTIVE },
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
      const freeSub = await this.prisma.subscription.create({
        data: {
          userId,
          planId,
          storeLimit: subscriptionSettings.storeLimit,
          productLimit: subscriptionSettings.productLimit,
          status: EnumSubscriptionStatus.ACTIVE,
          customerId: customer.stripeCustomerId as string,
          createdAt: new Date(),
          period: subscriptionSettings.period,
        },
      });
      console.log('111 CREATE NEW SUB = ', freeSub);

      return `${process.env.CLIENT_URL}/billing?success=true&planId=${planId}`;
    }

    const date = new Date();
    const nextBillingDate = new Date(
      new Date(date).setMonth(
        date.getMonth() +
          (subscriptionSettings.period === BillingCycle.MONTHLY ? 1 : 12),
      ),
    );
    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planId,
        storeLimit: subscriptionSettings.storeLimit,
        productLimit: subscriptionSettings.productLimit,
        status: EnumSubscriptionStatus.PENDING,
        customerId: customer.stripeCustomerId as string,
        createdAt: new Date(),
        nextBillingDate,
        period: subscriptionSettings.period,
      },
    });
    console.log('222 CREATE NEW SUB = ', subscription);
    const previousSub =
      (await this.prisma.subscription.count({
        where: {
          userId,
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
              userId,
              planId,
            },
          };
    const user = await this.userService.getById(userId);
    const email = user?.email || null;
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
                subscriptionSettings.period === BillingCycle.MONTHLY
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
        userId,
        planId,
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
   * Создаёт подключённый аккаунт продавца
   */
  async createConnectedAccount(email: string) {
    const account = await this.stripe.accounts.create({
      type: 'express',
      country: 'US',
      email,
      capabilities: { transfers: { requested: true } },
    });

    return account;
  }

  async createStripeTransfer(amount: number, destinationAccountId: string) {
    const transfer = await this.stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      destination: destinationAccountId,
    });
    return transfer;
  }
  /**
   * Генерация ссылки для онбординга продавца
   */
  async createAccountLink(accountId: string) {
    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.CLIENT_URL}/onboarding/refresh`,
      return_url: `${process.env.CLIENT_URL}/onboarding/success`,
      type: 'account_onboarding',
    });

    return { accountLink: accountLink.url };
  }

  async createConnectAccountStripe(user: User) {
    let createdAccountId: string = user.stripeAccountId || '';
    console.log('\n\n [Func] createConnectAccountStripe for user', user);
    if (!user.stripeAccountId) {
      const createdAccount = await this.createConnectedAccount(user.email);
      createdAccountId = createdAccount.id;
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { stripeAccountId: createdAccountId },
    });
    const accountLink = await this.createAccountLink(createdAccountId);
    return accountLink;
  }

  async pay(dto: OrderDto, userId: string) {
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
      });

      sessions.push({ sellerStripeId, url: session.url });
    }

    return sessions[0];
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
    console.log('\n\n [Func] onSubscriptionUpdated event');
    const session = event.data.object;
    let sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: session.id },
    });
    if (!sub) {
      console.log('[customer.subscription.updated] No subscription found');
      sub = await this.prisma.subscription.findFirst({
        where: {
          customerId: session.customer as string,
          status: EnumSubscriptionStatus.ACTIVE,
        },
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
      subUpdateData.nextPlanId = sub.nextPlanId
        ? sub.nextPlanId
        : EnumSubscriptionType.FREE;
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
    console.log('\n\n [Func] onCheckoutSessionCompleted');
    const session = event.data.object;
    console.log('\nsession.metadata = ', session.metadata);
    const { userId, planId } = session.metadata as {
      userId: string;
      planId: EnumSubscriptionType;
    };

    const user = await this.userService.getById(userId);
    if (user && !user.email) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { email: session.customer_details?.email as string },
      });
    }

    const oldSub = await this.prisma.subscription.findFirst({
      where: { userId, status: EnumSubscriptionStatus.ACTIVE },
    });
    if (oldSub) {
      if (oldSub.planId === EnumSubscriptionType.FREE) {
        console.log('222 Update Sub');
        await this.prisma.subscription.update({
          where: { id: oldSub.id },
          data: { status: EnumSubscriptionStatus.CANCELLED },
        });
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

    let sub: Subscription | null;
    if (userId && planId) {
      sub = await this.prisma.subscription.findFirst({
        where: { userId, status: EnumSubscriptionStatus.PENDING, planId },
      });
      if (!sub) {
        sub = await this.prisma.subscription.findFirst({
          where: { userId, status: EnumSubscriptionStatus.ACTIVE, planId },
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
          this.calculateNextBillingDate(stripeSubscription);
        const trialing = stripeSubscription.status === 'trialing';

        sub = await this.prisma.subscription.create({
          data: {
            userId,
            status: EnumSubscriptionStatus.ACTIVE,
            planId: planId,
            storeLimit: subscriptionSettings.storeLimit,
            productLimit: subscriptionSettings.productLimit,
            period: subscriptionSettings.period,
            customerId: session.customer as string,
            createdAt: new Date(),
            nextBillingDate,
            stripeSubscriptionId: session.subscription as string,
            trialEndAt: trialing ? nextBillingDate : null,
          },
        });
        console.log('333 CREATE NEW SUB = ', sub);
        return;
      }
    } else {
      sub = await this.prisma.subscription.findFirst({
        where: {
          customerId: session.customer as string,
          status: EnumSubscriptionStatus.PENDING,
        },
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

    let nextBillingDate: Date | null = null;
    if (
      stripeSubscription.status === 'trialing' &&
      stripeSubscription.trial_end
    ) {
      nextBillingDate = new Date(stripeSubscription.trial_end * 1000);
    } else if ((stripeSubscription as any).current_period_end) {
      nextBillingDate = this.calculateNextBillingDate(stripeSubscription);
    } else {
      nextBillingDate = new Date(); // fallback
    }
    console.log('333 Update Sub');

    await this.prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: EnumSubscriptionStatus.ACTIVE,
        storeLimit: subscriptionSettings.storeLimit,
        productLimit: subscriptionSettings.productLimit,
        stripeSubscriptionId: session.subscription as string,
        nextBillingDate,
        trialEndAt:
          stripeSubscription.status === 'trialing'
            ? new Date((stripeSubscription as any).trial_end * 1000)
            : null,
      },
    });
  }

  async onInvoicePaymentSucceeded(event: Stripe.InvoicePaymentSucceededEvent) {
    console.log('\n\n [Func] onInvoicePaymentSucceeded');
    const session = event.data.object;
    let sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: (session as any).subscription as string },
    });
    if (!sub) {
      const { userId, planId } = (session as any).subscription_details
        .metadata as {
        userId: string;
        planId: EnumSubscriptionType;
      };
      sub = await this.prisma.subscription.findFirst({
        where: { userId, status: EnumSubscriptionStatus.PENDING, planId },
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

    await this.prisma.subscription.update({
      where: { id: sub.id },
      data: {
        stripeSubscriptionId: (session as any).subscription as string,
        status: EnumSubscriptionStatus.ACTIVE,
        // nextBillingDate: new Date(
        //   (stripeSubscription as any).current_period_end * 1000,
        // ),
        nextBillingDate: this.calculateNextBillingDate(stripeSubscription),
        trialEndAt:
          stripeSubscription.status === 'trialing'
            ? new Date((stripeSubscription as any).trial_end * 1000)
            : null,
      },
    });
  }

  async onCustomerSubscriptionDeleted(
    event: Stripe.CustomerSubscriptionDeletedEvent,
  ) {
    console.log('\n\n [Func] onCustomerSubscriptionDeleted');
    const session = event.data.object;
    let sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: session.id },
    });
    if (!sub) {
      console.log('[customer.subscription.deleted] No subscription found');
      sub = await this.prisma.subscription.findFirst({
        where: {
          customerId: session.customer as string,
          status: EnumSubscriptionStatus.ACTIVE,
        },
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

      try {
        const date = new Date();
        const nextBillingDate = new Date(
          new Date(date).setMonth(
            date.getMonth() + (plan.period === BillingCycle.MONTHLY ? 1 : 12),
          ),
        );
        const customer = await this.prisma.billingInfo.findUnique({
          where: { userId: sub.userId },
        });

        const newSub = await this.prisma.subscription.create({
          data: {
            userId: sub.userId,
            status: EnumSubscriptionStatus.PENDING,
            planId: sub.nextPlanId,
            customerId: customer?.stripeCustomerId as string,
            createdAt: new Date(),
            nextBillingDate,
            period: plan.period,
          },
        });
        console.log('444 CREATE NEW SUB = ', sub);

        if (plan.planId == EnumSubscriptionType.FREE) {
          console.log('555 Update Sub');

          await this.prisma.subscription.update({
            where: { id: newSub.id },
            data: {
              status: EnumSubscriptionStatus.ACTIVE,
              storeLimit: plan.storeLimit,
              productLimit: plan.productLimit,
              nextBillingDate: null,
            },
          });
          console.log('666 Update Sub');

          await this.prisma.subscription.update({
            where: { id: sub.id },
            data: {
              cancelledAt: new Date(),
              cancelledReason: JSON.parse(
                JSON.stringify(event.data.object.cancellation_details),
              ),
              status: EnumSubscriptionStatus.CANCELLED,
            },
          });
          return;
        }

        try {
          const subscription = await this.stripe.subscriptions.create({
            customer: customer?.stripeCustomerId as string,
            items: [
              {
                price_data: {
                  currency: 'USD',
                  product: plan.stripeProductId,
                  recurring: {
                    interval:
                      plan.period === BillingCycle.MONTHLY ? 'month' : 'year',
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
          await this.prisma.subscription.update({
            where: { id: newSub.id },
            data: {
              stripeSubscriptionId: subscription.id,
              nextBillingDate: this.calculateNextBillingDate(subscription),
              status:
                subscription.status === 'active'
                  ? EnumSubscriptionStatus.ACTIVE
                  : newSub.status,
            },
          });
        } catch (err) {
          const freePlan = await this.prisma.plan.findUnique({
            where: { planId: EnumSubscriptionType.FREE },
          });
          console.log('888 Update Sub');
          await this.prisma.subscription.update({
            where: { id: newSub.id },
            data: {
              planId: EnumSubscriptionType.FREE,
              status: EnumSubscriptionStatus.ACTIVE,
              nextBillingDate: null,
              storeLimit: freePlan?.storeLimit,
              productLimit: freePlan?.productLimit,
            },
          });
        }
      } catch (err) {
        console.log(
          `StripeService.onCustomerSubscriptionDeleted() : failed: ${err}`,
        );
      }
    }
    console.log('999 Update Sub');
    await this.prisma.subscription.update({
      where: { id: sub.id },
      data: {
        cancelledAt: new Date(),
        cancelledReason: JSON.parse(
          JSON.stringify(event.data.object.cancellation_details),
        ),
        status: EnumSubscriptionStatus.CANCELLED,
      },
    });

    const newSub = await this.prisma.subscription.findFirst({
      where: { userId: sub.userId, status: EnumSubscriptionStatus.ACTIVE },
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

      const newFreeSub = await this.prisma.subscription.create({
        data: {
          userId: sub.userId,
          status: EnumSubscriptionStatus.ACTIVE,
          planId: EnumSubscriptionType.FREE,
          storeLimit: subscriptionSettings.storeLimit,
          productLimit: subscriptionSettings.productLimit,
          period: subscriptionSettings.period,
          customerId: customer?.stripeCustomerId as string,
          createdAt: new Date(),
          nextBillingDate: null,
        },
      });
      console.log('555 CREATE NEW SUB = ', newFreeSub);
    }
  }

  async onCustomerSubscriptionPaused(
    event: Stripe.CustomerSubscriptionPausedEvent,
  ) {
    console.log('\n\n [Func] onCustomerSubscriptionPaused');
    const session = event.data.object;
    const sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: session.id },
    });
    if (!sub) {
      console.log('[customer.subscription.paused] No subscription found');
      return;
    }

    console.log('101010 Update Sub');
    await this.prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: EnumSubscriptionStatus.PAUSED,
        pausedAt: new Date(),
      },
    });
  }

  async onCustomerSubscriptionResumed(
    event: Stripe.CustomerSubscriptionResumedEvent,
  ) {
    console.log('\n\n [Func] onCustomerSubscriptionResumed');
    const session = event.data.object;
    const sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: session.id },
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
        : null;
    console.log('11.11.11 Update Sub');
    await this.prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: EnumSubscriptionStatus.ACTIVE,
        nextBillingDate: nextBillingDate,
        pausedAt: null,
      },
    });
  }

  async onInvoicePaymentFailed(event: Stripe.InvoicePaymentFailedEvent) {
    console.log('\n\n [Func] onInvoicePaymentFailed');
    const session = event.data.object;
    if (!(session as any).subscription) return;

    const sub = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: (session as any).subscription as string },
    });
    if (!sub) {
      console.log('[invoice.payment_failed] No subscription found');
      return;
    }
    console.log('12.12.12 Update Sub');
    await this.prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: EnumSubscriptionStatus.OVERDUE,
      },
    });
  }

  // TODO
  async onPaymentMethodAttached(event: Stripe.PaymentMethodAttachedEvent) {
    console.log('\n\n [Func] onPaymentMethodAttached');
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
      return null;
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
}
