import { db } from '../db';
import { landingPagesTable } from '../db/schema';
import { type UpdateLandingPageInput, type LandingPage } from '../schema';
import { eq } from 'drizzle-orm';

export const updateLandingPage = async (input: UpdateLandingPageInput): Promise<LandingPage> => {
  try {
    // First, check if the landing page exists
    const existing = await db.select()
      .from(landingPagesTable)
      .where(eq(landingPagesTable.id, input.id))
      .execute();

    if (existing.length === 0) {
      throw new Error(`Landing page with id ${input.id} not found`);
    }

    // Build the update object with only the fields that are provided
    const updateData: any = {
      updated_at: new Date()
    };

    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    if (input.subtitle !== undefined) {
      updateData.subtitle = input.subtitle;
    }
    if (input.intro_text !== undefined) {
      updateData.intro_text = input.intro_text;
    }
    if (input.cta_button_text !== undefined) {
      updateData.cta_button_text = input.cta_button_text;
    }
    if (input.cta_button_url !== undefined) {
      updateData.cta_button_url = input.cta_button_url;
    }
    if (input.is_active !== undefined) {
      updateData.is_active = input.is_active;
    }

    // Perform the update
    const result = await db.update(landingPagesTable)
      .set(updateData)
      .where(eq(landingPagesTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Landing page update failed:', error);
    throw error;
  }
};