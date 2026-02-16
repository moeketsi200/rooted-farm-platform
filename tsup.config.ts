import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server/index.ts'],
  format: 'esm',
  outDir: 'dist',
  target: 'es2020',
  external: [
    'express',
    'express-session',
    'passport',
    'passport-local',
    'ws',
    'dotenv',
  ],
  noExternal: [],
  treeshake: true,
  sourcemap: true,
  clean: true,
});

