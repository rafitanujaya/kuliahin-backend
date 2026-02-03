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

    pgm.createType('days', ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']);

    // Monday (Senin), Tuesday (Selasa), Wednesday (Rabu), Thursday (Kamis), Friday (Jumat), Saturday (Sabtu), dan Sunday (Minggu)

    pgm.createTable('schedules', {
        id: {type: 'VARCHAR(255)', notNull: true, primaryKey: true},
        course_id: {type: 'VARCHAR(255)', notNull: true, references: 'courses', onDelete:'CASCADE'},
        day: {type: 'days', notNull: true},
        location: {type: 'VARCHAR(255)', notNull: true},
        start_time: {type: 'time', notNull: true},
        end_time: {type: 'time', notNull: true},
        created_at: {type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')},
    })

    pgm.createConstraint('schedules', 'fk_schedules_course_id', {
        foreignKeys: {
            columns: 'course_id',
            references: 'courses(id)',
            onDelete:'CASCADE'
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('schedules', 'fk_schedules_course_id')
    pgm.dropTable('schedules');
};
