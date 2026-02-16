import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server/index.ts'],
  format: 'cjs',
  outDir: 'dist',
  external: [
    'express',
    'express-session',
    'passport',
    'passport-local',
    'ws',
    'dotenv',
  ],
  resolveExtensions: ['.ts', '.js'],
  alias: {
    '@shared': './shared',
  },
  noExternal: [],
  treeshake: true,
  sourcemap: true,
  clean: true,
});

