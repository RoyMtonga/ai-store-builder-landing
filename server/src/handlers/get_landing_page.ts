import { db } from '../db';
import { landingPagesTable } from '../db/schema';
import { type LandingPage } from '../schema';
import { eq, desc } from 'drizzle-orm';

export const getLandingPage = async (): Promise<LandingPage | null> => {
  try {
    // Get the most recently updated active landing page
    const result = await db.select()
      .from(landingPagesTable)
      .where(eq(landingPagesTable.is_active, true))
      .orderBy(desc(landingPagesTable.updated_at))
      .limit(1)
      .execute();

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Get landing page failed:', error);
    throw error;
  }
};