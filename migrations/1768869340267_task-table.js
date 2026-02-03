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
    pgm.createType('status_tasks', ['todo', 'done'])
    pgm.createType('type_tasks', ['individu', 'kelompok'])
    pgm.createType('priority_tasks', ['low', 'medium', 'high'])

    pgm.createTable('tasks', {
        id: { type: 'VARCHAR(255)', notNull: true, primaryKey: true},
        user_id: { type: 'VARCHAR(255)', notNull: true, references: 'users', onDelete: 'CASCADE'},
        course_id: { type: 'VARCHAR(255)', notNull: true, references: 'courses', onDelete: 'CASCADE'},
        title: { type: 'VARCHAR(255)', notNull: true},
        description: { type: 'TEXT'},
        deadline: { type: 'TIMESTAMPTZ', notNull: true},
        status: { type: 'status_tasks', notNull: true},
        type: { type: 'type_tasks', notNull: true},
        priority: { type: 'priority_tasks', notNull: true},
        created_at: {type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')},
        updated_at: { type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')}
    })

    pgm.createConstraint('tasks', 'fk_tasks_user_id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'CASCADE'
        }
    })

    pgm.createConstraint('tasks', 'fk_tasks_course_id', {
        foreignKeys: {
            columns: 'course_id',
            references: 'courses(id)',
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
    pgm.dropConstraint('tasks', 'fk_tasks_user_id')
    pgm.dropConstraint('tasks', 'fk_tasks_course_id')
    pgm.dropTable('tasks')
    pgm.dropType('status_tasks')
    pgm.dropType('type_tasks')
    pgm.dropType('priority_tasks')
};
