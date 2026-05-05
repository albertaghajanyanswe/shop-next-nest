import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { FeatureExtractionPipeline, pipeline } from '@xenova/transformers';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EmbeddingService.name);
  private embedder: FeatureExtractionPipeline | null = null;
  private isInitialized = false;

  async onModuleInit() {
    try {
      this.logger.log('Initializing embedding model...');
      // Use multilingual model that supports Russian and English
      this.embedder = await pipeline(
        'feature-extraction',
        'Xenova/multilingual-e5-small',
      );
      this.isInitialized = true;
      this.logger.log('Embedding model initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize embedding model:', error);
      this.isInitialized = false;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    this.logger.log(`generateEmbedding: ${text}`);
    if (!this.isInitialized || !this.embedder) {
      throw new Error('Embedding model not initialized');
    }

    try {
      // Generate embedding
      const output = await this.embedder(text, {
        pooling: 'mean',
        normalize: true,
      });

      this.logger.log(`generateEmbedding result: ${Array.from(output.data)}`);

      // Convert to array
      return Array.from(output.data);
    } catch (error) {
      this.logger.error(`Error generating embedding for text: ${text}`, error);
      throw error;
    }
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    this.logger.log(`generateBatchEmbeddings: ${texts}`);

    if (!this.isInitialized || !this.embedder) {
      throw new Error('Embedding model not initialized');
    }

    try {
      const embeddings: number[][] = [];

      for (const text of texts) {
        const embedding = await this.generateEmbedding(text);
        embeddings.push(embedding);
      }

      this.logger.log(`generateBatchEmbeddings result: ${embeddings}`);

      return embeddings;
    } catch (error) {
      this.logger.error('Error generating batch embeddings', error);
      throw error;
    }
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}
