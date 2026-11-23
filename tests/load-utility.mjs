import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Type-only imports are removed by TypeScript; no application code is copied here.
export async function loadUtility(name) {
  let source = await readFile(new URL(`../src/utils/${name}.ts`, import.meta.url), 'utf8');
  if (source.includes('import dataset from "../data/wordlist.json";')) {
    const dataset = await readFile(new URL('../src/data/wordlist.json', import.meta.url), 'utf8');
    source = source.replace('import dataset from "../data/wordlist.json";', `const dataset = ${dataset};`);
  }
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
