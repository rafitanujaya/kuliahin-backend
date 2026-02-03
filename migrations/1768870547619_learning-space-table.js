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
    pgm.createTable('learning_spaces', {
        id: { type: 'VARCHAR(255)', notNull: true, primaryKey: true},
        user_id : { type: 'VARCHAR(255)', notNull: true, references: 'users', onDelete: 'CASCADE'},
        title: { type: 'VARCHAR(255)', notNull: true},
        description: { type: 'VARCHAR(255)', notNull: true},
        created_at: { type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')},
        updated_at: { type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')}
    })

    pgm.createType('type_learning_contents', ['pdf', 'docs', 'mp4', 'text'])

    pgm.createTable('learning_contents', {
        id: { type: 'VARCHAR(255)', notNull: true, primaryKey: true},
        learning_space_id: { type: 'VARCHAR(255)', notNull: true, references: 'learning_spaces', onDelete: 'CASCADE'},
        title: {type: 'VARCHAR(255)', notNull: true},
        type: { type: 'type_learning_contents', notNull: true},
        duration: { type: 'VARCHAR(255)'},
        file_path: { type: 'VARCHAR(255)'},
        file_url: { type: 'VARCHAR(255)'},
        file_size: { type: 'VARCHAR(255)'},
        mime_type: { type: 'VARCHAR(255)'},
        // order_index: { type: 'INTEGER', notNull: true},
        created_at: { type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')}
    })

    pgm.createTable('ai_insights', {
        id: { type: 'VARCHAR(255)', notNull: true, primaryKey: true},
        learning_space_id: { type: 'VARCHAR(255)', notNull: true, references: 'learning_spaces', onDelete: 'CASCADE', unique: true},
        content: { type: 'TEXT'},
        created_at: { type: 'TIMESTAMPTZ', notNull: true, default: pgm.func('current_timestamp')}
    })

    pgm.createConstraint('learning_spaces', 'fk_learning_spaces_user_id', {
        foreignKeys: {
            columns: 'user_id',
            references: 'users(id)',
            onDelete: 'CASCADE'
        }
    })

    pgm.createConstraint('learning_contents', 'fk_learning_contents_learning_space_id', {
        foreignKeys: {
            columns: 'learning_space_id',
            references: 'learning_spaces(id)',
            onDelete: 'CASCADE'
        }
    })

    pgm.createConstraint('ai_insights', 'fk_ai_insights_learning_space', {
        foreignKeys: {
            columns: 'learning_space_id',
            references: 'learning_spaces(id)',
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
    pgm.dropConstraint('learning_spaces', 'fk_learning_spaces_user_id')
    pgm.dropConstraint('learning_contents', 'fk_learning_contents_learning_space_id')
    pgm.dropConstraint('ai_insights', 'fk_ai_insights_learning_space')

    pgm.dropTable('ai_insights');
    pgm.dropTable('learning_contents');
    pgm.dropTable('learning_spaces');

    pgm.dropType('type_learning_contents')


};
