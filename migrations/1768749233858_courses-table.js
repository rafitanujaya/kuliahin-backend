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

    pgm.createType('type_course', ['teori', 'praktek', 'seminar'])

    pgm.createTable('courses', {
        id: {type: 'VARCHAR(255)', notNull: true, primaryKey: true},
        user_id: {type: 'VARCHAR(255)', notNull: true, references: 'users', onDelete: 'CASCADE'},
        name: {type: 'VARCHAR(255)', notNull: true},
        sks: {type: 'INT', notNull: true},
        type: {type: 'type_course', notNull: true},
        lecturer: {type: 'VARCHAR(255)', notNull: true},
        created_at: {type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')},
    })

    pgm.createConstraint('courses', 'fk_courses_user_id', {
        foreignKeys: {
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
    pgm.dropConstraint('courses', 'fk_courses_user_id')
    pgm.dropTable('courses')
};
