
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { MikroORM } from '@mikro-orm/core'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT ?? 26772);
const db = process.env.DB_NAME ?? 'defaultdb';
const user = process.env.DB_USER ?? 'avnadmin';
const pass = process.env.DB_PASS ?? '';
const caPath = process.env.CA_PATH ?? './certs/ca.pem';

const isProd = process.env.NODE_ENV === 'production';
const clientUrl = isProd
    ? `mysql://${user}:${encodeURIComponent(pass)}@${host}:${port}/${db}?ssl-mode=REQUIRED`
    : `mysql://${user}:${encodeURIComponent(pass)}@${host}:${port}/${db}`;

const sslExists = fs.existsSync(path.resolve(caPath));
if (!sslExists) {
    console.warn(`[warn] CA file not found at ${caPath}. Aiven requiere SSL — asegurate de descargar el certificado CA y poner su ruta en CA_PATH.`);
}

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: db,
    type: 'mysql',
    clientUrl,
    highlighter: new SqlHighlighter(),
    debug: true,
    // driverOptions pasa opciones al cliente mysql2/knex
    driverOptions: {
        connection: {
            // Si no existe el CA, esto puede fallar; preferible tenerlo.
            ssl: sslExists && isProd
                ? {
                    // lee el PEM y pásalo como string o Buffer
                    ca: fs.readFileSync(path.resolve(caPath)).toString(),
                    // rejectUnauthorized por defecto true; opcional:
                    rejectUnauthorized: true,
                }
                : undefined,
        },
    },
    schemaGenerator: {
        // cuidado: dropSchema + createSchema borran todo
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
});

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator()
    await generator.updateSchema()
    //await generator.dropSchema()
    //await generator.createSchema()
}

export const getEm = () => {
    if (!orm) throw new Error('ORM not initialized. Call initORM() first.');
    return orm.em.fork();
};