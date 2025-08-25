import type { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';
import { ByteResolver, TimestampResolver } from 'graphql-scalars';

const config: CodegenConfig = {
  emitLegacyCommonJSImports: false,
  schema: process.env.NEXT_PUBLIC_MAINNET_SUBGRAPH,
  documents: ['./src/**/*.{ts,tsx}', '!./src/subgraphs/*'],
  ignoreNoDocuments: true,
  generates: {
    './src/subgraphs/': {
      preset: 'client',
      config: {
        documentMode: 'string',
        strictScalars: false,
        scalars: {
          BigInt: 'bigint',
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
