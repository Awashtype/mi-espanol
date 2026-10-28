import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const progress = sqliteTable('progress', {
  userId: text('user_id').primaryKey(),
  progressJson: text('progress_json').notNull(),
  version: integer('version').notNull(),
  updatedAt: text('updated_at').notNull(),
});
