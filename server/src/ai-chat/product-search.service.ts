import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { EmbeddingService } from './embedding.service';

export interface ProductDetailFilter {
  operator: '>' | '<' | '>=' | '<=' | '=';
  value: string;
}

export interface ProductSearchFilters {
  categories?: string[];
  brand?: string;
  color?: string;
  store?: string;
  title?: string;
  description?: string;
  productDetails?: Record<string, string | ProductDetailFilter>;
  productDetailsLogic?: 'AND' | 'OR';
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductSearchResult {
  id: string;
  title: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  images: string[];
  quantity: number;
  store: {
    id: string;
    title: string;
  } | null;
  category: {
    id: string;
    name: string;
  } | null;
  brand: {
    id: string;
    name: string;
  } | null;
  color: {
    id: string;
    name: string;
    value: string;
  } | null;
  productDetails: Array<{
    key: string;
    value: string;
  }>;
  similarity?: number;
}

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    store: {
      select: {
        id: true;
        title: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
      };
    };
    brand: {
      select: {
        id: true;
        name: true;
      };
    };
    color: {
      select: {
        id: true;
        name: true;
        value: true;
      };
    };
    productDetails: {
      select: {
        key: true;
        value: true;
      };
    };
  };
}>;

@Injectable()
export class ProductSearchService {
  private readonly logger = new Logger(ProductSearchService.name);

  // Synonym mapping for product detail keys
  private readonly synonymMap: Record<string, string[]> = {
    memory: ['memory', 'storage', 'rom', 'встроенная память', 'память', 'ssd', 'hard disk'],
    ram: ['ram', 'оперативная память', 'озу'],
    cpu: ['cpu', 'processor', 'процессор'],
    display: ['display', 'screen type', 'screen', 'экран', 'дисплей', 'тип экрана'],
    battery: ['battery', 'батарея', 'аккумулятор'],
    camera: ['camera', 'камера'],
    weight: ['weight', 'вес'],
    color: ['color', 'цвет'],
    os: ['os', 'operating system', 'операционная система'],
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async searchProducts(
    query: string,
    limit = 10,
  ): Promise<ProductSearchResult[]> {
    try {
      this.logger.log(`Searching products with query: "${query}"`);

      // Try semantic search first if embedding service is ready
      if (this.embeddingService.isReady()) {
        const semanticResults = await this.semanticSearch(query, limit);
        if (semanticResults.length > 0) {
          this.logger.log(
            `Found ${semanticResults.length} products via semantic search`,
          );
          return semanticResults;
        }
      }

      // Fallback to keyword search
      this.logger.log('Falling back to keyword search');
      return await this.keywordSearch(query, limit);
    } catch (error) {
      this.logger.error(
        `Error searching products: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  async searchProductsWithFilters(
    filters: ProductSearchFilters,
    limit = 10,
  ): Promise<ProductSearchResult[]> {
    try {
      this.logger.log(
        `Product search Searching products with filters:`,
        filters,
      );

      const whereConditions: any[] = [
        { isPublished: true },
        { isBlocked: false },
      ];

      // Category filter (support multiple categories)
      if (filters.categories && filters.categories.length > 0) {
        whereConditions.push({
          OR: filters.categories.map((cat) => ({
            category: {
              name: {
                contains: cat,
                mode: 'insensitive',
              },
            },
          })),
        });
      }

      // Brand filter
      if (filters.brand) {
        whereConditions.push({
          brand: {
            name: {
              contains: filters.brand,
              mode: 'insensitive',
            },
          },
        });
      }

      // Color filter
      if (filters.color) {
        whereConditions.push({
          color: {
            name: {
              contains: filters.color,
              mode: 'insensitive',
            },
          },
        });
      }

      // Store filter
      if (filters.store) {
        whereConditions.push({
          store: {
            title: {
              contains: filters.store,
              mode: 'insensitive',
            },
          },
        });
      }

      // Title filter
      if (filters.title) {
        whereConditions.push({
          title: {
            contains: filters.title,
            mode: 'insensitive',
          },
        });
      }

      // Description filter
      if (filters.description) {
        whereConditions.push({
          description: {
            contains: filters.description,
            mode: 'insensitive',
          },
        });
      }

      // Price range filters
      if (filters.minPrice !== undefined) {
        whereConditions.push({
          price: {
            gte: filters.minPrice,
          },
        });
      }

      if (filters.maxPrice !== undefined) {
        whereConditions.push({
          price: {
            lte: filters.maxPrice,
          },
        });
      }

      // Product details filters
      if (
        filters.productDetails &&
        Object.keys(filters.productDetails).length > 0
      ) {
        // Get all products first, then filter in memory for complex comparisons
        const allProducts = await this.prisma.product.findMany({
          where: {
            AND: whereConditions,
          },
          include: {
            store: {
              select: {
                id: true,
                title: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            brand: {
              select: {
                id: true,
                name: true,
              },
            },
            color: {
              select: {
                id: true,
                name: true,
                value: true,
              },
            },
            productDetails: {
              select: {
                key: true,
                value: true,
              },
            },
          },
        });

        // Filter products based on productDetails with comparisons
        const filteredProducts = allProducts.filter((product) =>
          this.matchesProductDetails(
            product.productDetails,
            filters.productDetails!,
            filters.productDetailsLogic || 'AND',
          ),
        );

        this.logger.log(
          `Filtered ${filteredProducts.length} products from ${allProducts.length} based on productDetails`,
        );

        return filteredProducts
          .slice(0, limit)
          .map((product) => this.mapProductToResult(product));
      }

      this.logger.log(
        'searchProductsWithFilters: whereConditions - ',
        whereConditions,
      );
      const products = await this.prisma.product.findMany({
        where: {
          AND: whereConditions,
        },
        include: {
          store: {
            select: {
              id: true,
              title: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
            },
          },
          color: {
            select: {
              id: true,
              name: true,
              value: true,
            },
          },
          productDetails: {
            select: {
              key: true,
              value: true,
            },
          },
        },
        take: limit,
        orderBy: [{ totalViews: 'desc' }, { createdAt: 'desc' }],
      });

      this.logger.log(`Structured search found ${products.length} products`);

      return products.map((product) => this.mapProductToResult(product));
    } catch (error) {
      this.logger.error('Error in structured search:', error);
      throw error;
    }
  }

  private async semanticSearch(
    query: string,
    limit: number,
  ): Promise<ProductSearchResult[]> {
    try {
      // Generate embedding for query
      const queryEmbedding =
        await this.embeddingService.generateEmbedding(query);

      // Get all products with embeddings
      const products = await this.prisma.product.findMany({
        where: {
          AND: [
            { isPublished: true },
            { isBlocked: false },
            { embedding: { not: Prisma.JsonNull } },
          ],
        },
        include: {
          store: {
            select: {
              id: true,
              title: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          brand: {
            select: {
              id: true,
              name: true,
            },
          },
          color: {
            select: {
              id: true,
              name: true,
              value: true,
            },
          },
          productDetails: {
            select: {
              key: true,
              value: true,
            },
          },
        },
      });

      // Calculate similarity scores
      const productsWithScores = products
        .map((product) => {
          const productEmbedding = product.embedding as number[];
          const similarity = this.embeddingService.cosineSimilarity(
            queryEmbedding,
            productEmbedding,
          );

          return {
            product,
            similarity,
          };
        })
        .filter((item) => item.similarity > 0.5) // Threshold for relevance
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      this.logger.log(
        `Semantic search found ${productsWithScores.length} products`,
      );

      return productsWithScores.map((item) => ({
        ...this.mapProductToResult(item.product),
        similarity: item.similarity,
      }));
    } catch (error) {
      this.logger.error('Error in semantic search:', error);
      return [];
    }
  }

  private async keywordSearch(
    query: string,
    limit: number,
  ): Promise<ProductSearchResult[]> {
    const products = await this.prisma.product.findMany({
      where: {
        AND: [
          { isPublished: true },
          { isBlocked: false },
          {
            OR: [
              {
                title: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                category: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                brand: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                store: {
                  title: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                productDetails: {
                  some: {
                    OR: [
                      {
                        key: {
                          contains: query,
                          mode: 'insensitive',
                        },
                      },
                      {
                        value: {
                          contains: query,
                          mode: 'insensitive',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        store: {
          select: {
            id: true,
            title: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        color: {
          select: {
            id: true,
            name: true,
            value: true,
          },
        },
        productDetails: {
          select: {
            key: true,
            value: true,
          },
        },
      },
      take: limit,
      orderBy: [{ totalViews: 'desc' }, { createdAt: 'desc' }],
    });

    this.logger.log(`Keyword search found ${products.length} products`);

    return products.map((product) => this.mapProductToResult(product));
  }

  async generateProductEmbedding(productId: string): Promise<void> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          brand: true,
          productDetails: true,
        },
      });

      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }

      // Create searchable text from product data
      const searchableText = this.createSearchableText(product);

      // Generate embedding
      const embedding =
        await this.embeddingService.generateEmbedding(searchableText);

      // Save to database
      await this.prisma.product.update({
        where: { id: productId },
        data: { embedding: embedding as unknown as Prisma.InputJsonValue },
      });

      this.logger.log(`Generated embedding for product: ${product.title}`);
    } catch (error) {
      this.logger.error(
        `Error generating embedding for product ${productId}:`,
        error,
      );
      throw error;
    }
  }

  async generateAllEmbeddings(): Promise<void> {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          isPublished: true,
          isBlocked: false,
        },
        select: { id: true },
      });

      this.logger.log(
        `Generating embeddings for ${products.length} products...`,
      );

      for (const product of products) {
        await this.generateProductEmbedding(product.id);
      }

      this.logger.log('All embeddings generated successfully');
    } catch (error) {
      this.logger.error('Error generating all embeddings:', error);
      throw error;
    }
  }

  private createSearchableText(product: any): string {
    const parts: string[] = [];

    // Add title (most important)
    if (product.title) {
      parts.push(product.title);
    }

    // Add category
    if (product.category?.name) {
      parts.push(product.category.name);
    }

    // Add brand
    if (product.brand?.name) {
      parts.push(product.brand.name);
    }

    // Add description
    if (product.description) {
      parts.push(product.description);
    }

    // Add product details
    if (product.productDetails && product.productDetails.length > 0) {
      const details = product.productDetails
        .map((d: any) => `${d.key}: ${d.value}`)
        .join(', ');
      parts.push(details);
    }

    return parts.join(' ');
  }

  private mapProductToResult(
    product: ProductWithRelations,
  ): ProductSearchResult {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      images: product.images,
      quantity: product.quantity,
      store: product.store,
      category: product.category,
      brand: product.brand,
      color: product.color,
      productDetails: product.productDetails,
    };
  }

  /**
   * Extract numeric value from string like "130 GB", "130GB", "130"
   */
  private extractNumericValue(value: string): number | null {
    const match = value.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  }

  /**
   * Find canonical key from synonyms (case-insensitive)
   */
  private findCanonicalKey(searchKey: string): string {
    const lowerKey = searchKey.toLowerCase().trim();

    // First, try exact match with canonical keys
    for (const canonical of Object.keys(this.synonymMap)) {
      if (lowerKey === canonical) {
        return canonical;
      }
    }

    // Then, try synonym matching
    for (const [canonical, synonyms] of Object.entries(this.synonymMap)) {
      if (synonyms.some((syn) => lowerKey.includes(syn.toLowerCase()) || syn.toLowerCase().includes(lowerKey))) {
        return canonical;
      }
    }

    return lowerKey;
  }

  /**
   * Check if product details match the filter criteria
   */
  private matchesProductDetails(
    productDetails: Array<{ key: string; value: string }>,
    filterDetails: Record<string, string | ProductDetailFilter>,
    logic: 'AND' | 'OR' = 'AND',
  ): boolean {
    this.logger.log(`Matching with logic: ${logic}`);

    const results: boolean[] = [];

    for (const [filterKey, filterValue] of Object.entries(filterDetails)) {
      const canonicalFilterKey = this.findCanonicalKey(filterKey);

      this.logger.log(
        `Matching filter key "${filterKey}" → canonical: "${canonicalFilterKey}"`,
      );

      // Find matching product detail by canonical key
      const matchingDetail = productDetails.find((detail) => {
        const canonicalDetailKey = this.findCanonicalKey(detail.key);
        return canonicalDetailKey === canonicalFilterKey;
      });

      if (!matchingDetail) {
        this.logger.log(
          `No matching detail found for "${filterKey}". Available keys: ${productDetails.map((d) => d.key).join(', ')}`,
        );
        results.push(false);

        // For AND logic, if any condition fails, return false immediately
        if (logic === 'AND') {
          return false;
        }
        continue;
      }

      this.logger.log(
        `Found matching detail: ${matchingDetail.key} = ${matchingDetail.value}`,
      );

      let conditionMet = false;

      // Handle comparison operators
      if (typeof filterValue === 'object' && 'operator' in filterValue) {
        const productValue = this.extractNumericValue(matchingDetail.value);
        const filterNumValue = this.extractNumericValue(filterValue.value);

        this.logger.log(
          `Comparing: ${productValue} ${filterValue.operator} ${filterNumValue}`,
        );

        if (productValue === null || filterNumValue === null) {
          this.logger.warn(
            `Could not extract numeric values: product="${matchingDetail.value}", filter="${filterValue.value}"`,
          );
          conditionMet = false;
        } else {
          conditionMet = this.compareValues(
            productValue,
            filterValue.operator,
            filterNumValue,
          );
        }

        this.logger.log(`Comparison result: ${conditionMet}`);
      } else {
        // Exact string match (case-insensitive contains)
        const filterStr = String(filterValue).toLowerCase();
        conditionMet = matchingDetail.value.toLowerCase().includes(filterStr);

        this.logger.log(
          `String match: "${matchingDetail.value}" contains "${filterStr}" = ${conditionMet}`,
        );
      }

      results.push(conditionMet);

      // For AND logic, if any condition fails, return false immediately
      if (logic === 'AND' && !conditionMet) {
        return false;
      }

      // For OR logic, if any condition succeeds, return true immediately
      if (logic === 'OR' && conditionMet) {
        return true;
      }
    }

    // For AND logic: all conditions must be true (we already returned false if any failed)
    // For OR logic: at least one condition must be true
    const finalResult = logic === 'AND' ? results.every((r) => r) : results.some((r) => r);
    this.logger.log(`Final result (${logic}): ${finalResult}`);
    return finalResult;
  }

  /**
   * Compare numeric values based on operator
   */
  private compareValues(
    productValue: number,
    operator: string,
    filterValue: number,
  ): boolean {
    switch (operator) {
      case '>':
        return productValue > filterValue;
      case '<':
        return productValue < filterValue;
      case '>=':
        return productValue >= filterValue;
      case '<=':
        return productValue <= filterValue;
      case '=':
        return productValue === filterValue;
      default:
        return false;
    }
  }
}
