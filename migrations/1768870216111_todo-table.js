/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {

    pgm.createType('category_todos', ['personal', 'belajar', 'organisasi', 'lainnya'])
    pgm.createType('status_todos', ['todo', 'done'])

    pgm.createTable('todos', {
        id: { type: 'VARCHAR(255)', notNull: true, primaryKey: true},
        user_id: { type: 'VARCHAR(255)' , notNull: true, references: 'users', onDelete: 'CASCADE'},
        title: { type: 'VARCHAR(255)', notNull: true},
        category: { type: 'category_todos', notNull: true},
        status: { type: 'status_todos', notNull: true}
    })

    pgm.createConstraint('todos', 'fk_todos_user_id', {
        foreignKeys : {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'CASCADE'
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('todos', 'fk_todos_user_id')
    pgm.dropTable('todos')
    pgm.dropType('category_todos')
    pgm.dropType('status_todos')
};
