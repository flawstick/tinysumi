import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  uuid,
  boolean,
  jsonb,
  real,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `tiny_sumi_${name}`);

export const users = createTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  username: varchar("username", { length: 100 }).unique(),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  lastSeen: timestamp("last_seen", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
});

export const tasks = createTable("task", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).notNull().default("todo"), // 'todo', 'in_progress', 'paused', 'completed'
  priority: varchar("priority", { length: 50 }).notNull().default("medium"), // 'low', 'medium', 'high'
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  createdById: uuid("created_by_id").references(() => users.id),
  assignedToId: uuid("assigned_to_id").references(() => users.id),
});

export const memories = createTable("memory", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  date: timestamp("date", { withTimezone: true }),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  createdById: uuid("created_by_id").references(() => users.id),
});

export const memoryImages = createTable("memory_image", {
  id: uuid("id").defaultRandom().primaryKey(),
  memoryId: uuid("memory_id")
    .references(() => memories.id)
    .notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  caption: varchar("caption", { length: 255 }),
  order: integer("order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const favorites = createTable("favorite", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  memoryId: uuid("memory_id")
    .references(() => memories.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const pushNotificationTokens = createTable("push_notification_token", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  expoToken: varchar("expo_token", { length: 255 }).notNull(),
  deviceName: varchar("device_name", { length: 255 }),
  isValid: boolean("is_valid").default(true).notNull(),
  sessionToken: varchar("session_token", { length: 255 }).references(
    () => sessions.sessionToken,
  ),
  lastUsed: timestamp("last_used", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const notifications = createTable("notification", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body"),
  type: varchar("type", { length: 50 }).notNull(), // 'task', 'memory', 'system', etc.
  status: varchar("status", { length: 50 }).default("pending").notNull(), // 'pending', 'sent', 'failed'
  metadata: jsonb("metadata").$type<Record<string, any>>(), // Additional data like taskId, memoryId, etc.
  sentToTokens: jsonb("sent_to_tokens").$type<string[]>().default([]), // Array of push notification token IDs that received this notification
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }), // For scheduled notifications
  sentAt: timestamp("sent_at", { withTimezone: true }), // When the notification was actually sent
  readAt: timestamp("read_at", { withTimezone: true }), // When the user read the notification
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const phoneLocations = createTable("phone_location", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  accuracy: real("accuracy"),
  deviceName: varchar("device_name", { length: 255 }),
  batteryLevel: real("battery_level"),
  isCharging: boolean("is_charging"),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const accounts = createTable(
  "account",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  tasks: many(tasks, { relationName: "createdTasks" }),
  assignedTasks: many(tasks, { relationName: "assignedTasks" }),
  memories: many(memories),
  favorites: many(favorites),
  phoneLocations: many(phoneLocations),
  pushNotificationTokens: many(pushNotificationTokens),
  notifications: many(notifications),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
    relationName: "createdTasks",
  }),
  assignedTo: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
    relationName: "assignedTasks",
  }),
}));

export const memoriesRelations = relations(memories, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [memories.createdById],
    references: [users.id],
  }),
  images: many(memoryImages),
  favorites: many(favorites),
}));

export const memoryImagesRelations = relations(memoryImages, ({ one }) => ({
  memory: one(memories, {
    fields: [memoryImages.memoryId],
    references: [memories.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  memory: one(memories, {
    fields: [favorites.memoryId],
    references: [memories.id],
  }),
}));

export const phoneLocationsRelations = relations(phoneLocations, ({ one }) => ({
  user: one(users, {
    fields: [phoneLocations.userId],
    references: [users.id],
  }),
}));

export const pushNotificationTokensRelations = relations(
  pushNotificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [pushNotificationTokens.userId],
      references: [users.id],
    }),
    session: one(sessions, {
      fields: [pushNotificationTokens.sessionToken],
      references: [sessions.sessionToken],
    }),
  }),
);

export const notificationsRelations = relations(
  notifications,
  ({ one, many }) => ({
    user: one(users, {
      fields: [notifications.userId],
      references: [users.id],
    }),
    sentToDevices: many(pushNotificationTokens),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
  pushNotificationTokens: many(pushNotificationTokens),
}));
