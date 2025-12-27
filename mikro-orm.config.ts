import { defineConfig } from '@mikro-orm/mysql';
import 'dotenv/config';

export default defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    emit: 'ts',
  },
});