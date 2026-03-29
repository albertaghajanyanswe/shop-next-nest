// src/ai-agent/interfaces/agent.interfaces.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─────────────────────────────────────────────────────────────
// WebSocket Event Payloads
// ─────────────────────────────────────────────────────────────

export class WsJoinPayload {
  @ApiPropertyOptional({ description: 'Existing session ID to restore' })
  sessionId?: string;
}

export class WsMessagePayload {
  @ApiProperty({ description: 'Chat session ID' })
  sessionId!: string;

  @ApiProperty({ description: 'User message text' })
  content!: string;
}

export class WsStopPayload {
  @ApiProperty({ description: 'Session ID to stop generation for' })
  sessionId!: string;
}

// ─────────────────────────────────────────────────────────────
// ProductForAgent — точно под твою Prisma схему
// ─────────────────────────────────────────────────────────────

export interface ProductDetailItem {
  key: string; // например: "RAM", "SSD", "CPU"
  value: string; // например: "48 GB", "512 GB", "Intel i7"
}

export interface ProductForAgent {
  id: string;
  title: string;
  description?: string;
  price: string; // "1299.00"
  oldPrice?: string; // "1499.00" — старая цена если есть
  currency: string; // "USD"
  inStock: boolean; // quantity > 0
  quantity: number; // реальное количество
  state: string; // "NEW" | "USED"  (EnumProductState)
  intendedFor: string; // "FREE" | "SALE" | "RENT" (EnumProductIntendedFor)
  images: string[];

  category: { title: string }; // маппится из category.name
  brand: { title: string }; // маппится из brand.name
  color: string | null; // color.name
  storeName: string | null; // store.title

  // productDetails из отдельной таблицы ProductDetail
  additionalInfo: ProductDetailItem[];
}

// ─────────────────────────────────────────────────────────────
// Tool calling types
// ─────────────────────────────────────────────────────────────

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// Streaming callbacks
// ─────────────────────────────────────────────────────────────

export interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onToolCall: (toolName: string, args: Record<string, unknown>) => void;
  onDone: () => void;
  onStopped: () => void;
  onError: (error: Error) => void;
}

// ─────────────────────────────────────────────────────────────
// Swagger response DTOs
// ─────────────────────────────────────────────────────────────

export class ChatSessionDto {
  @ApiProperty({ example: 'clx1234abcd' })
  id!: string;

  @ApiProperty({ example: 'user-cuid-123' })
  userId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class ChatMessageDto {
  @ApiProperty({ example: 'clx5678efgh' })
  id!: string;

  @ApiProperty({ enum: ['user', 'assistant', 'tool'] })
  role!: string;

  @ApiProperty({ example: 'Покажи ноутбуки Lenovo' })
  content!: string;

  @ApiPropertyOptional()
  wasStopped?: boolean;

  @ApiProperty()
  createdAt!: Date;
}

export class JoinedResponseDto {
  @ApiProperty({ description: 'Session ID for subsequent messages' })
  sessionId!: string;
}
