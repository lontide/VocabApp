import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Type-only imports are removed by TypeScript; no application code is copied here.
export async function loadUtility(name) {
  const source = await readFile(new URL(`../src/utils/${name}.ts`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
