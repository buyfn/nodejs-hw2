/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary();
        table.string('login').notNullable();
        table.string('password').notNullable();
        table.integer('age').notNullable();
        table.boolean('isDeleted').defaultTo(false);
    })
        .createTable('groups', (table) => {
            table.uuid('id').primary();
            table.string('name').notNullable();
            table.specificType('permissions', 'text ARRAY').notNullable();
        });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('users')
        .dropTable('groups');
}
