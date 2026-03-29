// src/ai-agent/tools/product-search.tool.ts
import { Injectable, Logger } from '@nestjs/common';
import { AgentTool, ProductForAgent } from '../interfaces/agent.interfaces';
import { PrismaService } from 'src/prisma.service';

export interface SearchProductsArgs {
  query?: string; // поиск по title / description
  category?: string; // Category.name
  brand?: string; // Brand.name
  color?: string; // Color.name
  storeName?: string; // Store.title
  specs?: Record<string, string>; // ProductDetail.key → partial value
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean; // quantity > 0
  state?: 'NEW' | 'USED';
  intendedFor?: 'FREE' | 'SALE' | 'RENT';
}

export interface SearchResult {
  found: number;
  products: ProductForAgent[];
  message?: string;
}

@Injectable()
export class ProductSearchTool {
  private readonly logger = new Logger(ProductSearchTool.name);

  private cache: ProductForAgent[] | null = null;
  private cacheExpiresAt = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor(private readonly prisma: PrismaService) {}

  // ── Grok tool definition ───────────────────────────────────────────────
  static getDefinition(): AgentTool {
    return {
      name: 'search_products',
      description: `Search for products in the catalog.
Always call this tool when user asks about products, prices, availability, or specifications.
Never answer from memory. Searches across all stores and products.`,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Free text search in product title or description',
          },
          category: {
            type: 'string',
            description:
              'Category name (case-insensitive). Examples: "notebook", "smartphone", "headphones"',
          },
          brand: {
            type: 'string',
            description:
              'Brand name (case-insensitive). Examples: "lenovo", "samsung", "apple"',
          },
          color: {
            type: 'string',
            description: 'Color name. Examples: "black", "white", "red"',
          },
          storeName: {
            type: 'string',
            description: 'Filter by specific store name',
          },
          specs: {
            type: 'object',
            description: `Filter by product technical specifications.
Key = spec name, value = partial match string.
Specs come from ProductDetail table (key/value pairs per product).
Examples: {"RAM": "48", "SSD": "512", "CPU": "i7", "GPU": "RTX", "Display": "14"}`,
            additionalProperties: { type: 'string' },
          },
          minPrice: {
            type: 'number',
            description: 'Minimum price (inclusive)',
          },
          maxPrice: {
            type: 'number',
            description: 'Maximum price (inclusive)',
          },
          inStockOnly: {
            type: 'boolean',
            description: 'Return only products with quantity > 0',
          },
          state: {
            type: 'string',
            enum: ['NEW', 'USED'],
            description: 'Product condition',
          },
          intendedFor: {
            type: 'string',
            enum: ['FREE', 'SALE', 'RENT'],
            description: 'Listing type filter',
          },
        },
        required: [],
      },
    };
  }

  // ── Execute search ─────────────────────────────────────────────────────
  async execute(args: SearchProductsArgs): Promise<SearchResult> {
    const catalog = await this.getCatalog();
    let results = [...catalog];

    if (args.category) {
      const v = args.category.toLowerCase();
      results = results.filter((p) =>
        p.category.title.toLowerCase().includes(v),
      );
    }

    if (args.brand) {
      const v = args.brand.toLowerCase();
      results = results.filter((p) => p.brand.title.toLowerCase().includes(v));
    }

    if (args.color) {
      const v = args.color.toLowerCase();
      results = results.filter(
        (p) => p.color?.toLowerCase().includes(v) ?? false,
      );
    }

    if (args.storeName) {
      const v = args.storeName.toLowerCase();
      results = results.filter(
        (p) => p.storeName?.toLowerCase().includes(v) ?? false,
      );
    }

    if (args.state) {
      results = results.filter((p) => p.state === args.state);
    }

    if (args.intendedFor) {
      results = results.filter((p) => p.intendedFor === args.intendedFor);
    }

    if (args.inStockOnly) {
      results = results.filter((p) => p.inStock);
    }

    if (args.minPrice !== undefined) {
      results = results.filter((p) => parseFloat(p.price) >= args.minPrice!);
    }

    if (args.maxPrice !== undefined) {
      results = results.filter((p) => parseFloat(p.price) <= args.maxPrice!);
    }

    if (args.query) {
      const q = args.query.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q),
      );
    }

    // Фильтр по ProductDetail (key/value таблица)
    // specs: { "RAM": "48", "SSD": "512" } — AND логика между ключами
    if (args.specs && Object.keys(args.specs).length > 0) {
      results = results.filter((product) =>
        Object.entries(args.specs!).every(([specKey, specValue]) =>
          product.additionalInfo.some(
            (detail) =>
              detail.key.toLowerCase().includes(specKey.toLowerCase()) &&
              detail.value.toLowerCase().includes(specValue.toLowerCase()),
          ),
        ),
      );
    }

    this.logger.debug(
      `search_products → ${results.length}/${catalog.length} | ${JSON.stringify(args)}`,
    );

    if (results.length === 0) {
      // Fallback: ближайшие по категории
      const fallback = catalog
        .filter(
          (p) =>
            !args.category ||
            p.category.title
              .toLowerCase()
              .includes(args.category.toLowerCase()),
        )
        .slice(0, 3);

      return {
        found: 0,
        products: [],
        message:
          fallback.length > 0
            ? `No exact matches. Closest available: ${fallback
                .map((p) => `${p.title} ($${p.price})`)
                .join(', ')}`
            : 'No products found for these criteria.',
      };
    }

    return { found: results.length, products: results };
  }

  // ── Load from DB with cache ────────────────────────────────────────────
  private async getCatalog(): Promise<ProductForAgent[]> {
    if (this.cache && Date.now() < this.cacheExpiresAt) {
      return this.cache;
    }

    const rows = await this.prisma.product.findMany({
      where: {
        isPublished: true,
        isBlocked: false,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        oldPrice: true,
        quantity: true,
        state: true, // EnumProductState: NEW | USED
        intendedFor: true, // EnumProductIntendedFor: FREE | SALE | RENT
        images: true,

        // Category — поле называется name (не title)
        category: {
          select: { name: true },
        },
        // Brand — поле называется name (не title)
        brand: {
          select: { name: true },
        },
        // Color
        color: {
          select: { name: true },
        },
        // Store
        store: {
          select: { title: true },
        },
        // ProductDetail — отдельная таблица с key/value
        productDetails: {
          select: { key: true, value: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    this.cache = rows.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? undefined,
      price: p.price.toFixed(2),
      oldPrice: p.oldPrice != null ? p.oldPrice.toFixed(2) : undefined,
      currency: 'USD',
      inStock: p.quantity > 0,
      quantity: p.quantity,
      state: p.state,
      intendedFor: p.intendedFor,
      images: p.images,

      // category.name → { title } для единообразия в агенте
      category: { title: p.category?.name ?? 'Unknown' },
      // brand.name → { title }
      brand: { title: p.brand?.name ?? 'Unknown' },

      color: p.color?.name ?? null,
      storeName: p.store?.title ?? null,

      // productDetails[{key, value}] — напрямую из таблицы ProductDetail
      additionalInfo: p.productDetails,
    }));

    this.cacheExpiresAt = Date.now() + this.CACHE_TTL;
    this.logger.log(`Catalog cached: ${this.cache.length} products`);

    return this.cache;
  }

  /** Сбросить кэш — вызывать при create/update/delete товара */
  invalidateCache(): void {
    this.cache = null;
    this.cacheExpiresAt = 0;
    this.logger.log('Catalog cache invalidated');
  }
}
