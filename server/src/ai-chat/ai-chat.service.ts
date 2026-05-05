import { Injectable, Logger } from '@nestjs/common';
import { OpenRouterService, ChatMessage, Tool } from './openrouter.service';
import { ProductSearchService } from './product-search.service';

import type {
  ProductSearchResult,
  ProductSearchFilters,
  ProductDetailFilter,
} from './product-search.service';

export interface ChatContext {
  messages: ChatMessage[];
  sessionId: string;
}

@Injectable()
export class AiChatService {
  private readonly logger = new Logger(AiChatService.name);
  private readonly systemPrompt = `You are an AI shopping assistant for an e-commerce platform.

Your job is to:
1. Understand user queries and extract structured filters:
   - categories (array of category names, e.g., ["tv", "notebook"])
   - brand name
   - color name (ONLY for product color, NOT for display/screen specifications)
   - productDetails (object with key-value pairs AND comparison operators)
   - store title
   - product title
   - product description (ONLY for general product description, NOT for technical specs)

2. CRITICAL: Technical specifications ALWAYS go to productDetails, NOT to description:
   - Display/Screen specs (IPS, OLED, Retina, etc.) → productDetails.display
   - Memory/Storage (GB, TB) → productDetails.memory
   - RAM → productDetails.ram
   - Battery (mAh) → productDetails.battery
   - CPU/Processor → productDetails.cpu
   - Screen size, resolution → productDetails

3. IMPORTANT: When parsing productDetails with comparisons:
   - Recognize synonyms: "memory", "storage", "ROM" are the same
   - Extract comparison operators: "больше" (>), "меньше" (<), "минимум" (>=), "максимум" (<=), exact match (=)
   - Extract numeric values from strings like "130 GB", "130GB", "130" → 130
   - Use semantic field names: "memory" for storage/ROM, "ram" for RAM, "cpu" for processor, "display" for screen type, "battery" for battery capacity

   CRITICAL - Smart RAM/Memory Detection:
   - RAM (оперативная память) is typically 2-32 GB in smartphones/laptops
   - Memory/Storage (встроенная память) is typically 64-2048 GB
   - If user says "RAM" but value is > 32GB, they mean "memory" (storage), NOT RAM
   - If user says "memory" but value is < 32GB, check context - could be RAM or storage

   Examples:
   - "RAM больше 120GB" → { "memory": { "operator": ">", "value": "120" } } (120GB is storage, not RAM!)
   - "RAM 8GB" → { "ram": { "operator": "=", "value": "8" } } (8GB is actual RAM)
   - "memory больше 130GB" → { "memory": { "operator": ">", "value": "130" } }
   - "RAM минимум 8GB" → { "ram": { "operator": ">=", "value": "8" } }
   - "storage 256GB" → { "memory": { "operator": "=", "value": "256" } }
   - "battery меньше 5000 mAh" → { "battery": { "operator": "<", "value": "5000" } }
   - "display IPS" → { "display": "IPS" }

4. NEVER invent products. You must ONLY use results returned from the search tool.

5. Logical Operators for productDetails:
   - When user says "и" (and) or lists multiple conditions → use productDetailsLogic: "AND" (all must match)
   - When user says "или" (or) → use productDetailsLogic: "OR" (at least one must match)
   - Default is "AND" if not specified

6. When a user sends a query:
   - Parse it into structured filters
   - If user asks for MULTIPLE categories (e.g., "tvs and notebooks"), put them in categories array
   - Call the "searchProducts" tool with extracted parameters

5. Response format:
   - You MUST stream your response progressively in chunks
   - First send a short acknowledgement message
   - Then stream product cards one by one

6. Each product must be returned in JSON format (NOT plain text):

{
  "type": "product_card",
  "data": {
    "id": string,
    "title": string,
    "image": string,
    "price": number,
    "currency": string,
    "description": string,
    "productDetails": object,
    "store": string,
    "url": string
  }
}

7. If no products found:
   - Suggest alternatives (different brand, color, specs)

8. Support interruption:
   - If a new user message arrives, STOP current response immediately
   - Do not continue previous results

9. Be concise. Do not output unnecessary explanations.

10. Always prioritize relevance over quantity.

Examples:

User: "Find black Lenovo laptops with 32GB RAM in Electronics store"
Tool call:
{
  "categories": ["laptop"],
  "brand": "Lenovo",
  "color": "black",
  "productDetails": { "ram": { "operator": "=", "value": "32" } },
  "store": "Electronics"
}

User: "Find iPhone with RAM more than 120GB"
Tool call:
{
  "categories": ["smartphone"],
  "brand": "Apple",
  "productDetails": { "memory": { "operator": ">", "value": "120" } }
}
Note: User said "RAM" but 120GB is storage, not RAM. Corrected to "memory".

User: "Find iPhone with memory more than 130GB"
Tool call:
{
  "categories": ["smartphone"],
  "brand": "Apple",
  "productDetails": { "memory": { "operator": ">", "value": "130" } }
}

User: "Find iPhone with memory more than 256GB, battery less than 5000 mAh, and IPS display"
Tool call:
{
  "categories": ["smartphone"],
  "brand": "Apple",
  "productDetails": {
    "memory": { "operator": ">", "value": "256" },
    "battery": { "operator": "<", "value": "5000" },
    "display": "IPS"
  },
  "productDetailsLogic": "AND"
}

User: "Find iPhone with RAM more than 8GB OR memory more than 256GB"
Tool call:
{
  "categories": ["smartphone"],
  "brand": "Apple",
  "productDetails": {
    "ram": { "operator": ">", "value": "8" },
    "memory": { "operator": ">", "value": "256" }
  },
  "productDetailsLogic": "OR"
}

User: "Find tvs and notebooks"
Tool call:
{
  "categories": ["tv", "notebook"]
}

Then stream:

Chunk 1:
"Found some great options 👇"

Chunk 2:
{ product_card... }

Chunk 3:
{ product_card... }`;

  private readonly searchProductsTool: Tool = {
    type: 'function',
    function: {
      name: 'searchProducts',
      description:
        'Search for products in the store based on structured filters. Extract categories (array), brand, color, store, title, description, and productDetails from user query.',
      parameters: {
        type: 'object',
        properties: {
          categories: {
            type: 'array',
            items: {
              type: 'string',
            },
            description:
              'Array of product category names (e.g., ["tv", "notebook", "laptop"]). Use multiple categories when user asks for multiple product types.',
          },
          brand: {
            type: 'string',
            description: 'Brand name (e.g., Lenovo, Apple, Samsung)',
          },
          color: {
            type: 'string',
            description: 'Color name (e.g., black, white, red)',
          },
          store: {
            type: 'string',
            description: 'Store title',
          },
          title: {
            type: 'string',
            description: 'Product title keywords',
          },
          description: {
            type: 'string',
            description: 'Product description keywords',
          },
          productDetails: {
            type: 'object',
            description:
              'Product specifications with comparison operators. Each key maps to either a string (exact match) or an object with operator and value. Operators: ">" (greater), "<" (less), ">=" (gte), "<=" (lte), "=" (equals). Use semantic keys: "memory" for storage/ROM, "ram" for RAM. Examples: {"memory": {"operator": ">", "value": "130"}}, {"ram": {"operator": ">=", "value": "8"}}',
            additionalProperties: {
              oneOf: [
                { type: 'string' },
                {
                  type: 'object',
                  properties: {
                    operator: {
                      type: 'string',
                      enum: ['>', '<', '>=', '<=', '='],
                    },
                    value: { type: 'string' },
                  },
                  required: ['operator', 'value'],
                },
              ],
            },
          },
          productDetailsLogic: {
            type: 'string',
            enum: ['AND', 'OR'],
            description:
              'Logical operator for combining productDetails filters. Use "AND" when user says "и" (and) - all conditions must match. Use "OR" when user says "или" (or) - at least one condition must match. Default is "AND".',
          },
          minPrice: {
            type: 'number',
            description: 'Minimum price filter',
          },
          maxPrice: {
            type: 'number',
            description: 'Maximum price filter',
          },
        },
      },
    },
  };

  constructor(
    private readonly openRouterService: OpenRouterService,
    private readonly productSearchService: ProductSearchService,
  ) {}

  async *processQuery(
    query: string,
    context: ChatContext,
    abortSignal?: AbortSignal,
  ): AsyncGenerator<{ type: 'text' | 'product_card'; data: any }> {
    try {
      this.logger.log(
        `processQuery: session - ${context.sessionId}, query - ${query.substring(0, 30)}`,
      );

      const messages: ChatMessage[] = [
        { role: 'system', content: this.systemPrompt },
        ...context.messages,
        { role: 'user', content: query },
      ];

      let hasToolCalls = false;
      let hasProcessedToolCall = false;

      for await (const chunk of this.openRouterService.streamChatCompletion(
        messages,
        [this.searchProductsTool],
        abortSignal,
      )) {
        if (chunk.type === 'content') {
          // Only stream text if no tool calls were made
          if (!hasToolCalls) {
            yield { type: 'text', data: chunk.data };
          }
        } else if (chunk.type === 'tool_calls') {
          // Skip duplicate tool calls
          if (hasProcessedToolCall) {
            this.logger.warn('⚠️ Skipping duplicate tool call');
            continue;
          }

          hasToolCalls = true;
          hasProcessedToolCall = true;

          const toolCalls = chunk.data;

          this.logger.log('✅ processQuery: toolCalls - ', toolCalls);
          for (const toolCall of toolCalls) {
            if (toolCall.function.name === 'searchProducts') {
              let filters: ProductSearchFilters;
              try {
                filters = JSON.parse(toolCall.function.arguments);
                this.logger.log(
                  '✅ processQuery: toolCall - filters - ',
                  filters,
                );
              } catch (e) {
                this.logger.error(
                  `Failed to parse searchProducts arguments: ${toolCall.function.arguments}`,
                );
                yield {
                  type: 'text',
                  data: 'Sorry, I had trouble understanding your product search criteria. Please try rephrasing.',
                };
                continue;
              }

              this.logger.log(
                'AI-chat Searching products with filters:',
                filters,
              );

              const products =
                await this.productSearchService.searchProductsWithFilters(
                  filters,
                  10,
                );

              this.logger.log(
                `Found ${products.length} products, yielding all...`,
              );

              if (products.length === 0) {
                yield {
                  type: 'text',
                  data: 'No products found matching your criteria. Try different filters.',
                };
              } else {
                // First yield the count message
                yield {
                  type: 'text',
                  data: `Found ${products.length} products 👇`,
                };

                // Then yield all product cards
                for (const product of products) {
                  this.logger.log(`Yielding product: ${product.title}`);
                  yield {
                    type: 'product_card',
                    data: this.formatProductCard(product),
                  };
                }

                this.logger.log(
                  `All ${products.length} products yielded successfully`,
                );
              }
            }
          }
        }
      }

      this.logger.log(`✅ Query completed`);

      this.logger.log(`Completed query for session: ${context.sessionId}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Error processing query: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  private formatProductCard(product: ProductSearchResult): any {
    const productDetails: Record<string, string> = {};
    product.productDetails.forEach((detail) => {
      productDetails[detail.key] = detail.value;
    });

    return {
      id: product.id,
      title: product.title,
      image: product.images[0] || '/placeholder.png',
      price: product.price,
      oldPrice: product.oldPrice,
      currency: 'USD',
      description: product.description || '',
      productDetails: productDetails,
      store: product.store?.title || 'Unknown Store',
      category: product.category?.name || '',
      brand: product.brand?.name || '',
      color: product.color?.name || '',
      url: `/product/${product.id}`,
      quantity: product.quantity,
    };
  }
}
