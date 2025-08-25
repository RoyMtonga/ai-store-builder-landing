// Placeholder database schema for standalone frontend application
import { serial, text, pgTable, timestamp, boolean } from 'drizzle-orm/pg-core';

// Create a proper Drizzle table structure to satisfy TypeScript
export const landingPagesTable = pgTable('landing_pages', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'), // Nullable by default
  intro_text: text('intro_text').notNull(),
  cta_button_text: text('cta_button_text').notNull(),
  cta_button_url: text('cta_button_url').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type LandingPage = typeof landingPagesTable.$inferSelect;
export type NewLandingPage = typeof landingPagesTable.$inferInsert;

// Export tables for proper query building
export const tables = { landingPages: landingPagesTable };