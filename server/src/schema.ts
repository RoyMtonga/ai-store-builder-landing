import { z } from 'zod';

// User schema - businesses using the SaaS platform
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  business_name: z.string(),
  subscription_status: z.enum(['trial', 'active', 'cancelled', 'expired']),
  subscription_plan: z.enum(['starter', 'professional', 'enterprise']).nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Input schema for creating users
export const createUserInputSchema = z.object({
  email: z.string().email(),
  business_name: z.string().min(1),
  subscription_plan: z.enum(['starter', 'professional', 'enterprise']).optional()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Input schema for updating users
export const updateUserInputSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  business_name: z.string().min(1).optional(),
  subscription_status: z.enum(['trial', 'active', 'cancelled', 'expired']).optional(),
  subscription_plan: z.enum(['starter', 'professional', 'enterprise']).nullable().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Store schema - AI-generated storefronts
export const storeSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  domain: z.string(),
  template_id: z.number().nullable(),
  ai_config: z.string(), // JSON string containing AI generation parameters
  status: z.enum(['draft', 'published', 'maintenance']),
  theme_colors: z.string().nullable(), // JSON string for color scheme
  custom_css: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Store = z.infer<typeof storeSchema>;

// Input schema for creating stores
export const createStoreInputSchema = z.object({
  user_id: z.number(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  domain: z.string().min(1),
  template_id: z.number().nullable().optional(),
  ai_config: z.string(), // AI generation parameters as JSON
  theme_colors: z.string().nullable().optional(),
  custom_css: z.string().nullable().optional()
});

export type CreateStoreInput = z.infer<typeof createStoreInputSchema>;

// Input schema for updating stores
export const updateStoreInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  domain: z.string().min(1).optional(),
  template_id: z.number().nullable().optional(),
  ai_config: z.string().optional(),
  status: z.enum(['draft', 'published', 'maintenance']).optional(),
  theme_colors: z.string().nullable().optional(),
  custom_css: z.string().nullable().optional()
});

export type UpdateStoreInput = z.infer<typeof updateStoreInputSchema>;

// Template schema - AI builder templates
export const templateSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.enum(['retail', 'restaurant', 'services', 'portfolio', 'blog', 'other']),
  preview_image: z.string().nullable(),
  template_config: z.string(), // JSON configuration for the template
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Template = z.infer<typeof templateSchema>;

// Input schema for creating templates
export const createTemplateInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  category: z.enum(['retail', 'restaurant', 'services', 'portfolio', 'blog', 'other']),
  preview_image: z.string().nullable().optional(),
  template_config: z.string(),
  is_active: z.boolean().optional()
});

export type CreateTemplateInput = z.infer<typeof createTemplateInputSchema>;

// Content schema - CMS content for stores
export const contentSchema = z.object({
  id: z.number(),
  store_id: z.number(),
  type: z.enum(['page', 'product', 'blog_post', 'menu_item', 'testimonial', 'faq']),
  title: z.string(),
  slug: z.string(),
  content_data: z.string(), // JSON containing the actual content structure
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  status: z.enum(['draft', 'published', 'archived']),
  sort_order: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Content = z.infer<typeof contentSchema>;

// Input schema for creating content
export const createContentInputSchema = z.object({
  store_id: z.number(),
  type: z.enum(['page', 'product', 'blog_post', 'menu_item', 'testimonial', 'faq']),
  title: z.string().min(1),
  slug: z.string().min(1),
  content_data: z.string(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  sort_order: z.number().int().optional()
});

export type CreateContentInput = z.infer<typeof createContentInputSchema>;

// Input schema for updating content
export const updateContentInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content_data: z.string().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  sort_order: z.number().int().optional()
});

export type UpdateContentInput = z.infer<typeof updateContentInputSchema>;

// Query input schema for filtering stores
export const getStoresInputSchema = z.object({
  user_id: z.number().optional(),
  status: z.enum(['draft', 'published', 'maintenance']).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional()
});

export type GetStoresInput = z.infer<typeof getStoresInputSchema>;

// Query input schema for filtering content
export const getContentInputSchema = z.object({
  store_id: z.number(),
  type: z.enum(['page', 'product', 'blog_post', 'menu_item', 'testimonial', 'faq']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional()
});

export type GetContentInput = z.infer<typeof getContentInputSchema>;