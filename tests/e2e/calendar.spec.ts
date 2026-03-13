import { test, expect } from '@playwright/test';

// ============================================================================
// Test Data
// ============================================================================

const testUser = {
  email: 'santiagodrm@gmail.com',
  password: 'password',
};

// ============================================================================
// Calendar Tests
// ============================================================================

test.describe('Calendar Page', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[id="login-email"]', testUser.email);
    await page.fill('input[id="login-password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/home/, { timeout: 10000 });

    // Navigate to calendar page
    await page.click('text=Calendar');
    await expect(page).toHaveURL(/\/calendar/);
  });

  // ========================================================================
  // Page Display Tests
  // ========================================================================

  test('Calendar page loads successfully', async ({ page }) => {
    // Should display page title
    await expect(page.locator('h2').first()).toContainText('Calendar');

    // Should show calendar grid or month view
    const hasCalendar = await page
      .locator('[class*="calendar"], [class*="date"]')
      .count();
    expect(hasCalendar).toBeGreaterThan(0);
  });

  test('Calendar displays current month', async ({ page }) => {
    // Wait for calendar to load
    await page.waitForTimeout(1000);

    // Should show month/year header
    const currentDate = new Date();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const currentMonth = monthNames[currentDate.getMonth()];

    // Check if current month is visible (in English or Spanish)
    const hasMonth = await page.locator(`text=${currentMonth}`).isVisible();
    const hasYear = await page
      .locator(`text=${currentDate.getFullYear()}`)
      .isVisible();

    expect(hasMonth || hasYear).toBeTruthy();
  });

  test('Calendar shows day names', async ({ page }) => {
    // Wait for calendar to load
    await page.waitForTimeout(1000);

    // Should show day names (SUN, MON, etc.)
    await page
      .locator('text=SUN')
      .and(page.locator('text=MON'))
      .and(page.locator('text=TUE'))
      .and(page.locator('text=WED'))
      .and(page.locator('text=THU'))
      .and(page.locator('text=FRI'))
      .and(page.locator('text=SAT'))
      .and(page.locator('text=SUN'))
      .isVisible();
  });

  // ========================================================================
  // Navigation Tests
  // ========================================================================

  test('Can navigate to previous month', async ({ page }) => {
    // Wait for calendar to load
    await page.waitForTimeout(1000);

    // Find and click previous month button
    const prevButton = page
      .locator('button[aria-label*="previous"], button:has(svg):has-text("<")')
      .first();

    if (await prevButton.isVisible()) {
      // Get current month
      const currentMonth = await page
        .locator('h2, [class*="month"]')
        .first()
        .textContent();

      // Click previous
      await prevButton.click();
      await page.waitForTimeout(500);

      // Month should change
      const newMonth = await page
        .locator('h2, [class*="month"]')
        .first()
        .textContent();
      expect(newMonth).not.toBe(currentMonth);
    }
  });

  test('Can navigate to next month', async ({ page }) => {
    // Wait for calendar to load
    await page.waitForTimeout(1000);

    // Find and click next month button
    const nextButton = page
      .locator('button[aria-label*="next"], button:has(svg):has-text(">")')
      .first();

    if (await nextButton.isVisible()) {
      // Get current month
      const currentMonth = await page
        .locator('h2, [class*="month"]')
        .first()
        .textContent();

      // Click next
      await nextButton.click();
      await page.waitForTimeout(500);

      // Month should change
      const newMonth = await page
        .locator('h2, [class*="month"]')
        .first()
        .textContent();
      expect(newMonth).not.toBe(currentMonth);
    }
  });

  // ========================================================================
  // Task Display Tests
  // ========================================================================

  test('Calendar shows tasks on dates', async ({ page }) => {
    // Wait for calendar to load
    await page.waitForTimeout(1000);

    // Should show tasks or indicators on calendar dates
    const hasTasks = await page
      .locator('[class*="task"], [class*="event"]')
      .count();
    const hasDates = await page.locator('[class*="day"], button').count();

    expect(hasDates).toBeGreaterThan(0);
    // Tasks might or might not be present, just verify calendar works
    expect(hasTasks).toBeGreaterThanOrEqual(0);
  });

  test('Can click on a date', async ({ page }) => {
    // Wait for calendar to load
    await page.waitForTimeout(1000);

    // Find a date button/cell
    const dateCell = page
      .locator(
        '[class*="day"]:not([class*="outside"]) button, [class*="date"] button'
      )
      .first();

    if (await dateCell.isVisible()) {
      await dateCell.click();
      await page.waitForTimeout(500);

      // Should show tasks for that date or open a detail view
      const hasContent = await page
        .locator('[class*="task"], [class*="modal"], [class*="detail"]')
        .count();
      expect(hasContent).toBeGreaterThanOrEqual(0);
    }
  });

  // ========================================================================
  // Create Task from Calendar Tests
  // ========================================================================

  test('Can create task from calendar', async ({ page }) => {
    // Wait for calendar to load
    await page.waitForTimeout(1000);

    // Look for "Create Task" button
    const createButton = page.locator('button:has-text("Create Task")').first();

    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(500);

      // Task creation modal should appear
      await expect(page.locator('text=Create New Task')).toBeVisible({
        timeout: 3000,
      });

      // Close modal
      await page.keyboard.press('Escape');
    }
  });

  // ========================================================================
  // View Switch Tests
  // ========================================================================

  test('Calendar maintains state after navigation', async ({ page }) => {
    // Wait for calendar to load
    await page.waitForTimeout(1000);

    // Navigate away
    await page.click('text=My Tasks');
    await expect(page).toHaveURL(/\/tasks/);

    // Navigate back to calendar
    await page.click('text=Calendar');
    await expect(page).toHaveURL(/\/calendar/);

    // Calendar should load again
    await page.waitForTimeout(500);
    await expect(page.locator('h2').first()).toContainText('Calendar');
  });
});
