import { z } from 'zod';

// Landing page content schema
export const landingPageSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().nullable(),
  intro_text: z.string(),
  cta_button_text: z.string(),
  cta_button_url: z.string(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type LandingPage = z.infer<typeof landingPageSchema>;

// Input schema for creating landing page content
export const createLandingPageInputSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullable(),
  intro_text: z.string().min(1),
  cta_button_text: z.string().min(1),
  cta_button_url: z.string().url(),
  is_active: z.boolean().default(true)
});

export type CreateLandingPageInput = z.infer<typeof createLandingPageInputSchema>;

// Input schema for updating landing page content
export const updateLandingPageInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  subtitle: z.string().nullable().optional(),
  intro_text: z.string().min(1).optional(),
  cta_button_text: z.string().min(1).optional(),
  cta_button_url: z.string().url().optional(),
  is_active: z.boolean().optional()
});

export type UpdateLandingPageInput = z.infer<typeof updateLandingPageInputSchema>;