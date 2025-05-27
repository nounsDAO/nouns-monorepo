import type { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';
import { BigIntResolver, ByteResolver, TimestampResolver } from 'graphql-scalars';

const config: CodegenConfig = {
  emitLegacyCommonJSImports: false,
  schema: process.env.VITE_SEPOLIA_SUBGRAPH,
  documents: ['./src/**/*.{ts,tsx}', '!./src/subgraphs/*'],
  ignoreNoDocuments: true,
  generates: {
    './src/subgraphs/': {
      preset: 'client',
      config: {
        documentMode: 'string',
        strictScalars: false,
        scalars: {
          BigInt: BigIntResolver,
          Bytes: ByteResolver,
          Timestamp: TimestampResolver,
        },
        useTypeImports: true,
        namingConvention: {
          typeNames: 'change-case-all#pascalCase',
          transformUnderscore: true,
        },
      },
    },
    './src/subgraphs/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    }
  },
};

export default config;
