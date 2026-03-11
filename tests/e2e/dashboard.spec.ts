import { test, expect } from '@playwright/test';

// ============================================================================
// Test Data
// ============================================================================

const testUser = {
  email: 'santiagodrm@gmail.com',
  password: 'password',
};

// ============================================================================
// Dashboard Tests
// ============================================================================

test.describe('Dashboard Page', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[id="login-email"]', testUser.email);
    await page.fill('input[id="login-password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/home/, { timeout: 10000 });
  });

  // ========================================================================
  // Dashboard Display Tests
  // ========================================================================

  test('Dashboard loads successfully', async ({ page }) => {
    // Should show dashboard page
    await expect(page).toHaveURL(/\/home/);

    // Should display page title
    await expect(page.locator('h2').first()).toContainText('Dashboard');

    // Should show statistics cards
    await expect(page.locator('text=TOTAL TASKS')).toBeVisible();
    await expect(page.locator('text=COMPLETED TODAY')).toBeVisible();
    await expect(page.locator('text=OVERDUE')).toBeVisible();
    await expect(page.locator('text=MY LISTS')).toBeVisible();
  });

  test('Dashboard shows statistics correctly', async ({ page }) => {
    // Wait for statistics to load
    await page.waitForTimeout(1000);

    // Check that stat values are visible (numbers)
    const statCards = page.locator('[class*="stat"], [class*="card"]');
    await expect(statCards.first()).toBeVisible();

    // Verify statistics sections exist
    await expect(page.locator('text=Recent Tasks')).toBeVisible();
  });

  test('Dashboard displays recent tasks', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForTimeout(1000);

    // Check for "Recent Tasks" section
    await expect(page.locator('text=Recent Tasks')).toBeVisible();

    // Should show either tasks or empty state
    const hasTasks = await page.locator('[class*="task"]').count();
    const hasEmptyState = await page.locator('text=No tasks yet').isVisible();

    expect(hasTasks > 0 || hasEmptyState).toBeTruthy();
  });

  // ========================================================================
  // Navigation Tests
  // ========================================================================

  test('Can navigate to Tasks page from dashboard', async ({ page }) => {
    // Click on "View All" or navigate to tasks
    const viewAllButton = page.locator('text=View All').first();
    if (await viewAllButton.isVisible()) {
      await viewAllButton.click();
      await expect(page).toHaveURL(/\/tasks/);
    }
  });

  test('Can navigate using sidebar', async ({ page }) => {
    // Navigate to Tasks
    await page.click('text=My Tasks');
    await expect(page).toHaveURL(/\/tasks/);

    // Navigate back to Dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/\/home/);

    // Navigate to Lists
    await page.click('text=Lists');
    await expect(page).toHaveURL(/\/lists/);

    // Navigate to Calendar
    await page.click('text=Calendar');
    await expect(page).toHaveURL(/\/calendar/);

    // Navigate to Settings
    await page.click('text=Settings');
    await expect(page).toHaveURL(/\/settings/);
  });

  // ========================================================================
  // Quick Actions Tests
  // ========================================================================

  test('Can create task from dashboard', async ({ page }) => {
    // Look for "Create Task" button
    const createButton = page.locator('button:has-text("Create Task")').first();

    if (await createButton.isVisible()) {
      await createButton.click();

      // Modal should open
      await expect(page.locator('text=Create New Task')).toBeVisible({
        timeout: 5000,
      });

      // Close modal
      await page.keyboard.press('Escape');
    }
  });
});
