import { Injectable, Logger } from '@nestjs/common';
import { OpenRouterService, ChatMessage, Tool } from './openrouter.service';
import {
  ProductSearchService,
  ProductSearchResult,
  ProductSearchFilters,
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
   - color name
   - productDetails (its a list of key values e.g key: Ram, values: 32GB)
   - store title
   - product title
   - product description

2. NEVER invent products. You must ONLY use results returned from the search tool.

3. When a user sends a query:
   - Parse it into structured filters
   - If user asks for MULTIPLE categories (e.g., "tvs and notebooks"), put them in categories array
   - Call the "searchProducts" tool with extracted parameters

4. Response format:
   - You MUST stream your response progressively in chunks
   - First send a short acknowledgement message
   - Then stream product cards one by one

5. Each product must be returned in JSON format (NOT plain text):

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

6. If no products found:
   - Suggest alternatives (different brand, color, specs)

7. Support interruption:
   - If a new user message arrives, STOP current response immediately
   - Do not continue previous results

8. Be concise. Do not output unnecessary explanations.

9. Always prioritize relevance over quantity.

Examples:

User: "Find black Lenovo laptops with 32GB RAM in Electronics store"
Tool call:
{
  "categories": ["laptop"],
  "brand": "Lenovo",
  "color": "black",
  "productDetails": { "ram": "32GB" },
  "store": "Electronics"
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
              'Product specifications as key-value pairs (e.g., {"ram": "32GB", "cpu": "Intel i7"})',
            additionalProperties: {
              type: 'string',
            },
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
        `Processing query for session: ${context.sessionId} - ${query.substring(0, 30)}`,
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
          this.logger.log('✅ Processing first tool call');

          const toolCalls = chunk.data;

          for (const toolCall of toolCalls) {
            if (toolCall.function.name === 'searchProducts') {
              let filters: ProductSearchFilters;
              try {
                filters = JSON.parse(toolCall.function.arguments);
              } catch (e) {
                this.logger.error(`Failed to parse searchProducts arguments: ${toolCall.function.arguments}`);
                yield {
                  type: 'text',
                  data: 'Sorry, I had trouble understanding your product search criteria. Please try rephrasing.',
                };
                continue;
              }

              this.logger.log('Searching products with filters:', filters);

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
