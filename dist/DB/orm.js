import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
export const orm = await MikroORM.init({
    entities: ['dist//*.entity.js'],
    entitiesTs: ['src//.entity.ts'],
    dbName: 'ferrocarril',
    type: 'mysql',
    clientUrl: 'mysql://admin:admin@localhost:3306/conectar',
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: {
        // never in production
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: []
    }
});
export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
};
//# sourceMappingURL=orm.js.map