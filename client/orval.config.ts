import { defineConfig } from 'orval';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  client: {
    input: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/openapi.json`,
    output: {
      target: './src/generated/orval/api.ts',
      schemas: './src/generated/orval/types',
    },
  },
});
