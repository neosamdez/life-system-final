import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Player Stats Table - Armazena estatísticas de gamificação do jogador
export const playerStats = mysqlTable("playerStats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  level: int("level").default(1).notNull(),
  totalXp: int("totalXp").default(0).notNull(),

  // Atributos individuais com XP próprio
  strengthXp: int("strengthXp").default(0).notNull(),
  strengthLevel: int("strengthLevel").default(1).notNull(),

  intelligenceXp: int("intelligenceXp").default(0).notNull(),
  intelligenceLevel: int("intelligenceLevel").default(1).notNull(),

  charismaXp: int("charismaXp").default(0).notNull(),
  charismaLevel: int("charismaLevel").default(1).notNull(),

  vitalityXp: int("vitalityXp").default(0).notNull(),
  vitalityLevel: int("vitalityLevel").default(1).notNull(),

  wisdomXp: int("wisdomXp").default(0).notNull(),
  wisdomLevel: int("wisdomLevel").default(1).notNull(),

  agilityXp: int("agilityXp").default(0).notNull(),
  agilityLevel: int("agilityLevel").default(1).notNull(),

  // Streaks e atividade
  questsCompleted: int("questsCompleted").default(0).notNull(),
  streakDays: int("streakDays").default(0).notNull(),
  lastActivity: timestamp("lastActivity").defaultNow().notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlayerStats = typeof playerStats.$inferSelect;
export type InsertPlayerStats = typeof playerStats.$inferInsert;

// Quests Table - Armazena as missões do jogador
export const quests = mysqlTable("quests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  difficulty: mysqlEnum("difficulty", [
    "easy",
    "medium",
    "hard",
    "epic",
  ]).notNull(),
  attribute: mysqlEnum("attribute", [
    "strength",
    "intelligence",
    "charisma",
    "vitality",
    "wisdom",
    "agility",
  ]).notNull(),
  xpReward: int("xpReward").notNull(),
  status: mysqlEnum("status", ["active", "completed", "failed", "cancelled"])
    .default("active")
    .notNull(),
  dueDate: timestamp("dueDate"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Quest = typeof quests.$inferSelect;
export type InsertQuest = typeof quests.$inferInsert;

// Categories Table - Categorias de transações financeiras
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  name: varchar("name", { length: 100 }).notNull(),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 7 }),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// Transactions Table - Transações financeiras
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  categoryId: int("categoryId").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["income", "expense"]).notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  playerStats: one(playerStats, {
    fields: [users.id],
    references: [playerStats.userId],
  }),
  quests: many(quests),
  categories: many(categories),
  transactions: many(transactions),
}));

export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  user: one(users, {
    fields: [playerStats.userId],
    references: [users.id],
  }),
}));

export const questsRelations = relations(quests, ({ one }) => ({
  user: one(users, {
    fields: [quests.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));
