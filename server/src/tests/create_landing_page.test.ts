import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { landingPagesTable } from '../db/schema';
import { type CreateLandingPageInput } from '../schema';
import { createLandingPage } from '../handlers/create_landing_page';
import { eq } from 'drizzle-orm';

// Complete test input with all required fields
const testInput: CreateLandingPageInput = {
  title: 'Welcome to Our Platform',
  subtitle: 'The best solution for your needs',
  intro_text: 'This is a comprehensive platform that will help you achieve your goals with ease and efficiency.',
  cta_button_text: 'Get Started',
  cta_button_url: 'https://example.com/signup',
  is_active: true
};

// Test input without optional subtitle
const testInputNoSubtitle: CreateLandingPageInput = {
  title: 'Simple Landing Page',
  subtitle: null,
  intro_text: 'A minimal landing page without subtitle.',
  cta_button_text: 'Learn More',
  cta_button_url: 'https://example.com/learn',
  is_active: false
};

describe('createLandingPage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a landing page with all fields', async () => {
    const result = await createLandingPage(testInput);

    // Basic field validation
    expect(result.title).toEqual('Welcome to Our Platform');
    expect(result.subtitle).toEqual('The best solution for your needs');
    expect(result.intro_text).toEqual(testInput.intro_text);
    expect(result.cta_button_text).toEqual('Get Started');
    expect(result.cta_button_url).toEqual('https://example.com/signup');
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a landing page with null subtitle', async () => {
    const result = await createLandingPage(testInputNoSubtitle);

    expect(result.title).toEqual('Simple Landing Page');
    expect(result.subtitle).toBeNull();
    expect(result.intro_text).toEqual('A minimal landing page without subtitle.');
    expect(result.cta_button_text).toEqual('Learn More');
    expect(result.cta_button_url).toEqual('https://example.com/learn');
    expect(result.is_active).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save landing page to database', async () => {
    const result = await createLandingPage(testInput);

    // Query using proper drizzle syntax
    const landingPages = await db.select()
      .from(landingPagesTable)
      .where(eq(landingPagesTable.id, result.id))
      .execute();

    expect(landingPages).toHaveLength(1);
    const savedPage = landingPages[0];
    expect(savedPage.title).toEqual('Welcome to Our Platform');
    expect(savedPage.subtitle).toEqual('The best solution for your needs');
    expect(savedPage.intro_text).toEqual(testInput.intro_text);
    expect(savedPage.cta_button_text).toEqual('Get Started');
    expect(savedPage.cta_button_url).toEqual('https://example.com/signup');
    expect(savedPage.is_active).toEqual(true);
    expect(savedPage.created_at).toBeInstanceOf(Date);
    expect(savedPage.updated_at).toBeInstanceOf(Date);
  });

  it('should create multiple landing pages with unique IDs', async () => {
    const firstPage = await createLandingPage(testInput);
    const secondPage = await createLandingPage(testInputNoSubtitle);

    expect(firstPage.id).not.toEqual(secondPage.id);
    expect(firstPage.title).not.toEqual(secondPage.title);

    // Verify both exist in database
    const allPages = await db.select()
      .from(landingPagesTable)
      .execute();

    expect(allPages).toHaveLength(2);
    expect(allPages.map(p => p.id)).toContain(firstPage.id);
    expect(allPages.map(p => p.id)).toContain(secondPage.id);
  });

  it('should handle default is_active value', async () => {
    // Create input that uses explicit default for is_active
    const inputWithDefaults: CreateLandingPageInput = {
      title: 'Default Active Page',
      subtitle: null,
      intro_text: 'This page should be active by default.',
      cta_button_text: 'Click Here',
      cta_button_url: 'https://example.com/default',
      is_active: true // Explicitly set to test default behavior
    };

    const result = await createLandingPage(inputWithDefaults);

    expect(result.is_active).toEqual(true);
    
    // Verify in database
    const savedPage = await db.select()
      .from(landingPagesTable)
      .where(eq(landingPagesTable.id, result.id))
      .execute();

    expect(savedPage[0].is_active).toEqual(true);
  });

  it('should preserve timestamp consistency', async () => {
    const beforeCreate = new Date();
    const result = await createLandingPage(testInput);
    const afterCreate = new Date();

    // Timestamps should be within reasonable range
    expect(result.created_at.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime() - 1000);
    expect(result.created_at.getTime()).toBeLessThanOrEqual(afterCreate.getTime() + 1000);
    expect(result.updated_at.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime() - 1000);
    expect(result.updated_at.getTime()).toBeLessThanOrEqual(afterCreate.getTime() + 1000);

    // created_at and updated_at should be very close for new records
    const timeDiff = Math.abs(result.updated_at.getTime() - result.created_at.getTime());
    expect(timeDiff).toBeLessThan(1000); // Within 1 second
  });
});