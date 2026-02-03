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

    pgm.createTable('weekly_analyses', {
        id: { type: 'VARCHAR(255)', notNull: true, primaryKey: true},
        user_id: { type: 'VARCHAR(255)', notNull: true, references: 'users', onDelete: 'CASCADE' },
        week_start: { type: 'date', notNull: true },
        week_end: { type: 'date', notNull: true},
        insight: { type: 'TEXT', notNull: true},
        decision: { type: 'TEXT', notNull: true},
        created_at: { type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp') }
    })

    pgm.createConstraint('weekly_analyses', 'fk_weekly_analyses_user_id', {
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
    pgm.dropConstraint('weekly_analyses', 'fk_weekly_analyses_user_id')
    pgm.dropTable('weekly_analyses')
};
