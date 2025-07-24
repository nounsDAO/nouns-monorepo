/**
 * This script deduplicates ABI definitions in TypeScript declaration files (*.d.ts, *.d.mts).
 *
 * This is needed to avoid huge declaration files with repeated ABI definitions that are inlined
 * for every single exported function, making the declaration files grow to several MB in size and
 * overwhelming the TypeScript Intellisense in IDEs with the redundancy.
 *
 * ref: https://github.com/microsoft/TypeScript/issues/37151
 */

import { readFileSync, writeFileSync } from 'fs';

import { globSync } from 'glob';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function processFile(filePath: string): void {
  let content = readFileSync(filePath, 'utf-8');
  const abiVars = content.matchAll(/declare const ([A-Za-z]*Abi): (readonly (?:.|\n)+?^}]);/gm);

  for (const [, varName, abiBody] of Array.from(abiVars)) {
    const typeName = capitalize(varName);

    if (!abiBody) {
      console.debug(`    Warning: Could not extract ABI body for ${varName}`);
      continue;
    }

    // Insert type alias
    content = content.replace(
      `declare const ${varName}: ${abiBody};`,
      `declare const ${varName}: ${abiBody};

export type ${typeName} = typeof ${varName};`,
    );

    // replace all occurrences of the ABI body with the type name
    content = content.replaceAll(abiBody, typeName);
    // replace the first occurrence back to the original ABI body
    content = content.replace(typeName, abiBody);

    // The abi body also appears in the exported config indented with 4 spaces
    const configAbiBody = abiBody.replaceAll('\n', '\n    ');
    content = content.replace(configAbiBody, typeName);
  }

  writeFileSync(filePath, content);

  console.log(`Deduplicated abis on ${filePath}`);
}

function main(): void {
  const patterns = process.argv.slice(2);

  if (patterns.length === 0) {
    console.error('Usage: tsx deduplicate-abis.ts <pattern1> [pattern2] ...');
    process.exit(1);
  }

  // Expand all glob patterns
  const allFiles = patterns.flatMap(pattern => globSync(pattern));

  if (allFiles.length === 0) {
    console.log('No files found matching the provided patterns');
    return;
  }

  for (const file of allFiles) {
    processFile(file);
  }

  console.log('ABI deduplication complete!');
}

main();
