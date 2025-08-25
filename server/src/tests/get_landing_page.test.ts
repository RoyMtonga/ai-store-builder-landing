import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { landingPagesTable } from '../db/schema';
import { getLandingPage } from '../handlers/get_landing_page';
import { eq } from 'drizzle-orm';

describe('getLandingPage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no active landing pages exist', async () => {
    const result = await getLandingPage();
    expect(result).toBeNull();
  });

  it('should return null when only inactive landing pages exist', async () => {
    // Create an inactive landing page
    await db.insert(landingPagesTable)
      .values({
        title: 'Inactive Page',
        subtitle: 'Test subtitle',
        intro_text: 'This is an inactive landing page',
        cta_button_text: 'Click Here',
        cta_button_url: 'https://example.com',
        is_active: false
      })
      .execute();

    const result = await getLandingPage();
    expect(result).toBeNull();
  });

  it('should return the active landing page', async () => {
    // Create an active landing page
    const insertResult = await db.insert(landingPagesTable)
      .values({
        title: 'Welcome to Our Site',
        subtitle: 'Best place for everything',
        intro_text: 'This is our amazing landing page with lots of great content.',
        cta_button_text: 'Get Started',
        cta_button_url: 'https://example.com/signup',
        is_active: true
      })
      .returning()
      .execute();

    const result = await getLandingPage();

    expect(result).not.toBeNull();
    expect(result!.title).toBe('Welcome to Our Site');
    expect(result!.subtitle).toBe('Best place for everything');
    expect(result!.intro_text).toBe('This is our amazing landing page with lots of great content.');
    expect(result!.cta_button_text).toBe('Get Started');
    expect(result!.cta_button_url).toBe('https://example.com/signup');
    expect(result!.is_active).toBe(true);
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return the most recently updated active landing page when multiple exist', async () => {
    // Create first active landing page
    const firstPage = await db.insert(landingPagesTable)
      .values({
        title: 'First Page',
        subtitle: 'First subtitle',
        intro_text: 'First intro text',
        cta_button_text: 'First CTA',
        cta_button_url: 'https://example.com/first',
        is_active: true
      })
      .returning()
      .execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create second active landing page (should be more recent)
    const secondPage = await db.insert(landingPagesTable)
      .values({
        title: 'Second Page',
        subtitle: 'Second subtitle', 
        intro_text: 'Second intro text',
        cta_button_text: 'Second CTA',
        cta_button_url: 'https://example.com/second',
        is_active: true
      })
      .returning()
      .execute();

    const result = await getLandingPage();

    expect(result).not.toBeNull();
    expect(result!.title).toBe('Second Page');
    expect(result!.id).toBe(secondPage[0].id);
    expect(result!.updated_at.getTime()).toBeGreaterThanOrEqual(firstPage[0].updated_at!.getTime());
  });

  it('should handle landing page with null subtitle', async () => {
    // Create landing page with null subtitle
    await db.insert(landingPagesTable)
      .values({
        title: 'Page Without Subtitle',
        subtitle: null,
        intro_text: 'This page has no subtitle',
        cta_button_text: 'Continue',
        cta_button_url: 'https://example.com/continue',
        is_active: true
      })
      .execute();

    const result = await getLandingPage();

    expect(result).not.toBeNull();
    expect(result!.title).toBe('Page Without Subtitle');
    expect(result!.subtitle).toBeNull();
    expect(result!.intro_text).toBe('This page has no subtitle');
  });

  it('should prioritize most recently updated among multiple active pages', async () => {
    // Create first page
    const firstInsert = await db.insert(landingPagesTable)
      .values({
        title: 'Old Page',
        subtitle: 'Old subtitle',
        intro_text: 'Old content',
        cta_button_text: 'Old CTA',
        cta_button_url: 'https://example.com/old',
        is_active: true
      })
      .returning()
      .execute();

    // Create second page
    await db.insert(landingPagesTable)
      .values({
        title: 'Newer Page',
        subtitle: 'Newer subtitle',
        intro_text: 'Newer content',
        cta_button_text: 'New CTA',
        cta_button_url: 'https://example.com/new',
        is_active: true
      })
      .returning()
      .execute();

    // Wait a bit, then update the first page to make it most recent
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.update(landingPagesTable)
      .set({ 
        title: 'Recently Updated Page',
        updated_at: new Date()
      })
      .where(eq(landingPagesTable.id, firstInsert[0].id))
      .execute();

    const result = await getLandingPage();

    expect(result).not.toBeNull();
    expect(result!.title).toBe('Recently Updated Page');
    expect(result!.id).toBe(firstInsert[0].id);
  });

  it('should ignore inactive pages even if more recently updated', async () => {
    // Create active page first
    await db.insert(landingPagesTable)
      .values({
        title: 'Active Page',
        subtitle: 'Active subtitle',
        intro_text: 'Active content',
        cta_button_text: 'Active CTA',
        cta_button_url: 'https://example.com/active',
        is_active: true
      })
      .execute();

    // Wait and create inactive page (more recent)
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(landingPagesTable)
      .values({
        title: 'Inactive Page',
        subtitle: 'Inactive subtitle',
        intro_text: 'Inactive content',
        cta_button_text: 'Inactive CTA',
        cta_button_url: 'https://example.com/inactive',
        is_active: false
      })
      .execute();

    const result = await getLandingPage();

    expect(result).not.toBeNull();
    expect(result!.title).toBe('Active Page');
    expect(result!.is_active).toBe(true);
  });
});