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

    pgm.createType('provider', ['cridential', 'google']);
    pgm.createType('theme', ['light', 'dark']);

    pgm.createTable('users', {
        id: {type: 'VARCHAR(255)', notNull: true, primaryKey: true},
        fullname: {type: 'VARCHAR(50)', notNull: true},
        email: {type: 'VARCHAR(255)', notNull: true, unique: true},
        password: {type: 'VARCHAR(255)'},
        semester: {type: 'INT'},
        avatar_initial: {type: 'VARCHAR(4)', notNull: true},
        notif_deadline: { type: 'BOOLEAN', default: false },
        notif_schedule: { type: 'BOOLEAN', default: false },
        major: {type: 'VARCHAR(255)'},
        auth_provider: {type: 'provider', notNull: true, default: 'cridential'},
        theme: {type: 'theme', notNull: true, default: 'light'},
        created_at: {type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')},
        updated_at: {type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')}
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('users');
    pgm.dropType('provider');
    pgm.dropType('theme')
};
