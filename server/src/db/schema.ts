import { serial, text, pgTable, timestamp, boolean } from 'drizzle-orm/pg-core';

export const landingPagesTable = pgTable('landing_pages', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'), // Nullable by default, matches Zod schema
  intro_text: text('intro_text').notNull(),
  cta_button_text: text('cta_button_text').notNull(),
  cta_button_url: text('cta_button_url').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type LandingPage = typeof landingPagesTable.$inferSelect; // For SELECT operations
export type NewLandingPage = typeof landingPagesTable.$inferInsert; // For INSERT operations

// Important: Export all tables and relations for proper query building
export const tables = { landingPages: landingPagesTable };