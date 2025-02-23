import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  visitedAt: timestamp("visited_at").defaultNow().notNull()
});

export const insertHistorySchema = createInsertSchema(history).pick({
  url: true,
  title: true
});

export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type History = typeof history.$inferSelect;
