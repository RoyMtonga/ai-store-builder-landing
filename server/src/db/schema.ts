import { serial, text, pgTable, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define enums for better type safety
export const subscriptionStatusEnum = pgEnum('subscription_status', ['trial', 'active', 'cancelled', 'expired']);
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['starter', 'professional', 'enterprise']);
export const storeStatusEnum = pgEnum('store_status', ['draft', 'published', 'maintenance']);
export const templateCategoryEnum = pgEnum('template_category', ['retail', 'restaurant', 'services', 'portfolio', 'blog', 'other']);
export const contentTypeEnum = pgEnum('content_type', ['page', 'product', 'blog_post', 'menu_item', 'testimonial', 'faq']);
export const contentStatusEnum = pgEnum('content_status', ['draft', 'published', 'archived']);

// Users table - businesses using the SaaS platform
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  business_name: text('business_name').notNull(),
  subscription_status: subscriptionStatusEnum('subscription_status').notNull().default('trial'),
  subscription_plan: subscriptionPlanEnum('subscription_plan'), // Nullable - can be null for trial users
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Templates table - AI builder templates
export const templatesTable = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'), // Nullable
  category: templateCategoryEnum('category').notNull(),
  preview_image: text('preview_image'), // Nullable - URL to preview image
  template_config: text('template_config').notNull(), // JSON configuration
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Stores table - AI-generated storefronts
export const storesTable = pgTable('stores', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'), // Nullable
  domain: text('domain').notNull().unique(),
  template_id: integer('template_id').references(() => templatesTable.id), // Nullable - stores can be created without templates
  ai_config: text('ai_config').notNull(), // JSON string containing AI generation parameters
  status: storeStatusEnum('status').notNull().default('draft'),
  theme_colors: text('theme_colors'), // Nullable - JSON string for color scheme
  custom_css: text('custom_css'), // Nullable - custom CSS overrides
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Content table - CMS content for stores
export const contentTable = pgTable('content', {
  id: serial('id').primaryKey(),
  store_id: integer('store_id').notNull().references(() => storesTable.id, { onDelete: 'cascade' }),
  type: contentTypeEnum('type').notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  content_data: text('content_data').notNull(), // JSON containing the actual content structure
  meta_title: text('meta_title'), // Nullable - SEO meta title
  meta_description: text('meta_description'), // Nullable - SEO meta description
  status: contentStatusEnum('status').notNull().default('draft'),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Define relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  stores: many(storesTable)
}));

export const templatesRelations = relations(templatesTable, ({ many }) => ({
  stores: many(storesTable)
}));

export const storesRelations = relations(storesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [storesTable.user_id],
    references: [usersTable.id]
  }),
  template: one(templatesTable, {
    fields: [storesTable.template_id],
    references: [templatesTable.id]
  }),
  content: many(contentTable)
}));

export const contentRelations = relations(contentTable, ({ one }) => ({
  store: one(storesTable, {
    fields: [contentTable.store_id],
    references: [storesTable.id]
  })
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Template = typeof templatesTable.$inferSelect;
export type NewTemplate = typeof templatesTable.$inferInsert;

export type Store = typeof storesTable.$inferSelect;
export type NewStore = typeof storesTable.$inferInsert;

export type Content = typeof contentTable.$inferSelect;
export type NewContent = typeof contentTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  users: usersTable,
  templates: templatesTable,
  stores: storesTable,
  content: contentTable
};