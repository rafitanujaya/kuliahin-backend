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
  pgm.createType("type_notifications", ["schedule", "task"]);

  pgm.createTable("notifications", {
    id: { type: "VARCHAR(255)", notNull: true, primaryKey: true },
    user_id: {
      type: "VARCHAR(255)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    type: { type: "type_notifications", notNull: true },
    reference_id: { type: "VARCHAR(255)" },
    title: { type: "VARCHAR(255)" },
    message: { type: "VARCHAR(255)" },
    notify_at: { type: "TIMESTAMPTZ", notNull: true },
    is_sent: { type: "BOOLEAN", notNull: true, default: false },
    occurrence_date: {type: "DATE", notNull: true,},
    created_at: {
      type: "TIMESTAMPTZ",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createTable("push_subscriptions", {
    id: {
      type: "VARCHAR(255)", notNull: true, primaryKey: true
    },
    user_id: {
      type: "VARCHAR(255)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    endpoint: { type: "TEXT", notNull: true, unique: true },
    p256dh: { type: "TEXT", notNull: true },
    auth: { type: "TEXT", notNull: true },
    created_at: {
      type: "TIMESTAMPTZ",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createConstraint("push_subscriptions", "fk_push_subscriptions_user_id", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.createConstraint("notifications", "fk_notifications_users_user_id", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("notifications", "unique_notification_event", {
    unique: ["user_id", "type", "reference_id", "occurrence_date"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropConstraint("notifications", "fk_notifications_users_user_id");
  pgm.dropConstraint("notifications", "unique_notification_event");
  pgm.dropConstraint("push_subscriptions", "fk_push_subscriptions_user_id");
  pgm.dropTable("notifications");
  pgm.dropType("type_notifications");
};
