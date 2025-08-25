import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { landingPagesTable } from '../db/schema';
import { type UpdateLandingPageInput, type CreateLandingPageInput } from '../schema';
import { updateLandingPage } from '../handlers/update_landing_page';
import { eq } from 'drizzle-orm';

// Helper function to create a test landing page
const createTestLandingPage = async (): Promise<number> => {
  const testInput: CreateLandingPageInput = {
    title: 'Original Title',
    subtitle: 'Original Subtitle',
    intro_text: 'Original intro text content',
    cta_button_text: 'Original CTA',
    cta_button_url: 'https://original.example.com',
    is_active: true
  };

  const result = await db.insert(landingPagesTable)
    .values(testInput)
    .returning()
    .execute();

  return result[0].id;
};

describe('updateLandingPage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a single field', async () => {
    const landingPageId = await createTestLandingPage();

    const updateInput: UpdateLandingPageInput = {
      id: landingPageId,
      title: 'Updated Title'
    };

    const result = await updateLandingPage(updateInput);

    expect(result.id).toEqual(landingPageId);
    expect(result.title).toEqual('Updated Title');
    expect(result.subtitle).toEqual('Original Subtitle'); // Should remain unchanged
    expect(result.intro_text).toEqual('Original intro text content');
    expect(result.cta_button_text).toEqual('Original CTA');
    expect(result.cta_button_url).toEqual('https://original.example.com');
    expect(result.is_active).toBe(true);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update multiple fields', async () => {
    const landingPageId = await createTestLandingPage();

    const updateInput: UpdateLandingPageInput = {
      id: landingPageId,
      title: 'New Title',
      intro_text: 'New intro text',
      is_active: false
    };

    const result = await updateLandingPage(updateInput);

    expect(result.title).toEqual('New Title');
    expect(result.intro_text).toEqual('New intro text');
    expect(result.is_active).toBe(false);
    // Unchanged fields
    expect(result.subtitle).toEqual('Original Subtitle');
    expect(result.cta_button_text).toEqual('Original CTA');
    expect(result.cta_button_url).toEqual('https://original.example.com');
  });

  it('should update subtitle to null', async () => {
    const landingPageId = await createTestLandingPage();

    const updateInput: UpdateLandingPageInput = {
      id: landingPageId,
      subtitle: null
    };

    const result = await updateLandingPage(updateInput);

    expect(result.subtitle).toBeNull();
    expect(result.title).toEqual('Original Title'); // Should remain unchanged
  });

  it('should update all fields at once', async () => {
    const landingPageId = await createTestLandingPage();

    const updateInput: UpdateLandingPageInput = {
      id: landingPageId,
      title: 'Complete Update Title',
      subtitle: 'Complete Update Subtitle',
      intro_text: 'Completely updated intro text',
      cta_button_text: 'Updated CTA Button',
      cta_button_url: 'https://updated.example.com',
      is_active: false
    };

    const result = await updateLandingPage(updateInput);

    expect(result.title).toEqual('Complete Update Title');
    expect(result.subtitle).toEqual('Complete Update Subtitle');
    expect(result.intro_text).toEqual('Completely updated intro text');
    expect(result.cta_button_text).toEqual('Updated CTA Button');
    expect(result.cta_button_url).toEqual('https://updated.example.com');
    expect(result.is_active).toBe(false);
  });

  it('should update the updated_at timestamp', async () => {
    const landingPageId = await createTestLandingPage();

    // Get the original timestamp
    const original = await db.select()
      .from(landingPagesTable)
      .where(eq(landingPagesTable.id, landingPageId))
      .execute();

    const originalUpdatedAt = original[0].updated_at;

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdateLandingPageInput = {
      id: landingPageId,
      title: 'Updated Title'
    };

    const result = await updateLandingPage(updateInput);

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });

  it('should persist changes to database', async () => {
    const landingPageId = await createTestLandingPage();

    const updateInput: UpdateLandingPageInput = {
      id: landingPageId,
      title: 'Database Update Test',
      is_active: false
    };

    await updateLandingPage(updateInput);

    // Verify changes were persisted
    const dbResult = await db.select()
      .from(landingPagesTable)
      .where(eq(landingPagesTable.id, landingPageId))
      .execute();

    expect(dbResult).toHaveLength(1);
    expect(dbResult[0].title).toEqual('Database Update Test');
    expect(dbResult[0].is_active).toBe(false);
    expect(dbResult[0].subtitle).toEqual('Original Subtitle'); // Unchanged
  });

  it('should throw error when landing page does not exist', async () => {
    const nonExistentId = 99999;

    const updateInput: UpdateLandingPageInput = {
      id: nonExistentId,
      title: 'This should fail'
    };

    await expect(updateLandingPage(updateInput)).rejects.toThrow(
      /Landing page with id 99999 not found/i
    );
  });

  it('should handle empty update gracefully', async () => {
    const landingPageId = await createTestLandingPage();

    // Get original data
    const original = await db.select()
      .from(landingPagesTable)
      .where(eq(landingPagesTable.id, landingPageId))
      .execute();

    const updateInput: UpdateLandingPageInput = {
      id: landingPageId
      // No fields to update
    };

    const result = await updateLandingPage(updateInput);

    // All fields should remain the same except updated_at
    expect(result.title).toEqual(original[0].title);
    expect(result.subtitle).toEqual(original[0].subtitle);
    expect(result.intro_text).toEqual(original[0].intro_text);
    expect(result.cta_button_text).toEqual(original[0].cta_button_text);
    expect(result.cta_button_url).toEqual(original[0].cta_button_url);
    expect(result.is_active).toEqual(original[0].is_active);
    expect(result.updated_at.getTime()).toBeGreaterThan(original[0].updated_at.getTime());
  });

  it('should handle subtitle changes from null to string and back', async () => {
    // Create landing page with null subtitle
    const testInput: CreateLandingPageInput = {
      title: 'Test Title',
      subtitle: null,
      intro_text: 'Test intro text',
      cta_button_text: 'Test CTA',
      cta_button_url: 'https://test.example.com',
      is_active: true
    };

    const created = await db.insert(landingPagesTable)
      .values(testInput)
      .returning()
      .execute();

    const landingPageId = created[0].id;

    // Update from null to string
    const updateToString: UpdateLandingPageInput = {
      id: landingPageId,
      subtitle: 'New Subtitle'
    };

    const result1 = await updateLandingPage(updateToString);
    expect(result1.subtitle).toEqual('New Subtitle');

    // Update back to null
    const updateToNull: UpdateLandingPageInput = {
      id: landingPageId,
      subtitle: null
    };

    const result2 = await updateLandingPage(updateToNull);
    expect(result2.subtitle).toBeNull();
  });
});