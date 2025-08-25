import { db } from '../db';
import { landingPagesTable } from '../db/schema';
import { type CreateLandingPageInput, type LandingPage } from '../schema';

export const createLandingPage = async (input: CreateLandingPageInput): Promise<LandingPage> => {
  try {
    // Insert landing page record
    const result = await db.insert(landingPagesTable)
      .values({
        title: input.title,
        subtitle: input.subtitle,
        intro_text: input.intro_text,
        cta_button_text: input.cta_button_text,
        cta_button_url: input.cta_button_url,
        is_active: input.is_active
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Landing page creation failed:', error);
    throw error;
  }
};