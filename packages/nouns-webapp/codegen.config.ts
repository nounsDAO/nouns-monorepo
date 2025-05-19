import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';
import { TimestampResolver, BigIntResolver, ByteResolver } from 'graphql-scalars';

const config: CodegenConfig = {
  emitLegacyCommonJSImports: false,
  generates: {
    './src/subgraphs/index.ts': {
      schema: process.env.VITE_SEPOLIA_SUBGRAPH,
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
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
  },
};

export default config;
