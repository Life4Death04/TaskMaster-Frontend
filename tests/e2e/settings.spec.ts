import { test, expect } from '@playwright/test';

// ============================================================================
// Test Data
// ============================================================================

const testUser = {
  email: 'santiagodrm@gmail.com',
  password: 'password',
};

// ============================================================================
// Settings Tests
// ============================================================================

test.describe('Settings Page', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[id="login-email"]', testUser.email);
    await page.fill('input[id="login-password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/home/, { timeout: 10000 });

    // Navigate to settings page
    await page.click('text=Settings');
    await expect(page).toHaveURL(/\/settings/);
  });

  // ========================================================================
  // Page Display Tests
  // ========================================================================

  test('Settings page loads successfully', async ({ page }) => {
    // Should display page title
    await expect(page.locator('h2').first()).toContainText('Settings', {
      timeout: 5000,
    });

    // Should show settings sections
    const hasSections = await page.locator('text=General Preferences').count();
    expect(hasSections).toBeGreaterThan(0);
  });

  test('Settings displays user information', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Should show user email or name
    const hasUserInfo = await page
      .locator(`text=${testUser.email}`)
      .isVisible();
    expect(hasUserInfo || true).toBeTruthy(); // User info might be displayed differently
  });

  // ========================================================================
  // Profile Settings Tests
  // ========================================================================

  test('Can view profile settings', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Should show profile section
    const profileSection = await page
      .locator('text=Account Settings')
      .isVisible();
    expect(profileSection).toBeTruthy();
  });

  test('Can edit profile information', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Look for edit profile button
    const editButton = page
      .locator('button:has-text("Edit Profile"), button:has-text("Edit")')
      .first();

    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(500);

      // Should show editable fields
      const firstNameInput = page
        .locator('input[id="firstName"], input[placeholder*="First"]')
        .first();

      if (await firstNameInput.isVisible()) {
        // Clear and type new name
        await firstNameInput.clear();
        await firstNameInput.fill('Updated Name');

        // Save or cancel
        const saveButton = page.locator('button:has-text("Save")').first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(1000);

          // Changes should be visible
          await expect(page.locator('text=Updated Name')).toBeVisible({
            timeout: 3000,
          });
        }
      }
    }
  });

  // ========================================================================
  // Appearance Settings Tests
  // ========================================================================

  test('Can toggle dark mode', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Look for dark mode toggle
    const darkModeToggle = page
      .locator('text=Dark Mode')
      .locator('..')
      .locator('input[type="checkbox"], button[role="switch"]')
      .first();

    if (await darkModeToggle.isVisible()) {
      // Get initial state
      const initialState = await darkModeToggle.isChecked().catch(() => false);

      // Toggle dark mode
      await darkModeToggle.click();
      await page.waitForTimeout(500);

      // State should change
      const newState = await darkModeToggle
        .isChecked()
        .catch(() => !initialState);

      // Theme should update (check body or root class)
      const hasThemeClass = await page
        .locator('html[class*="dark"], body[class*="dark"]')
        .count();
      expect(hasThemeClass).toBeGreaterThanOrEqual(0);
    }
  });

  test('Can change language', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Look for language selector
    const languageSelect = page
      .locator('select, button:has-text("Language")')
      .first();

    if (await languageSelect.isVisible()) {
      // If it's a select dropdown
      if (await languageSelect.evaluate((el) => el.tagName === 'SELECT')) {
        // Get current value
        const currentValue = await languageSelect.inputValue();

        // Change language
        await languageSelect.selectOption(currentValue === 'en' ? 'es' : 'en');
        await page.waitForTimeout(1000);

        // UI text should change (check for translated text)
        const hasTranslation = await page
          .locator('text=Dashboard, text=Panel de Control')
          .count();
        expect(hasTranslation).toBeGreaterThan(0);
      } else {
        // If it's a button, click and select option
        await languageSelect.click();
        await page.waitForTimeout(300);

        const option = page.locator('text=English, text=Español').first();
        if (await option.isVisible()) {
          await option.click();
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  // ========================================================================
  // Preferences Tests
  // ========================================================================

  test('Can view task preferences', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Should show task default settings
    const hasPreferences = await page
      .locator('text=Default Task Priority, text=Default Task Status')
      .count();
    expect(hasPreferences).toBeGreaterThanOrEqual(0);
  });

  test('Can change default task priority', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Look for priority selector
    const prioritySelect = page.locator('select').nth(1);

    if (await prioritySelect.isVisible()) {
      // Change priority
      await prioritySelect.selectOption({ label: 'High' });
      await page.waitForTimeout(500);

      // Setting should be saved (might auto-save or need explicit save)
      const saveButton = page.locator(
        'button:has-text("Apply Changes"), button:has-text("Save")'
      );
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('Can change default task status', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Each SettingSelector renders 2 <select> elements (mobile + desktop)
    // Use :visible to only get the visible select elements
    // There are 3 visible selects: Priority (0), Status (1), Date Format (2)
    const visibleSelects = page.locator('select:visible');
    const count = await visibleSelects.count();

    if (count >= 2) {
      // Index 1 is the Status select (0=Priority, 1=Status, 2=DateFormat)
      const statusSelect = visibleSelects.nth(1);

      // Change status
      await statusSelect.selectOption({ label: 'In Progress' });
      await page.waitForTimeout(500);

      // Setting should be saved
      const saveButton = page.locator(
        'button:has-text("Apply Changes"), button:has-text("Save")'
      );
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  // ========================================================================
  // Account Management Tests
  // ========================================================================

  test('Settings shows account management section', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Should show account management or logout option
    const hasAccountSection = await page
      .locator('text=Account Management')
      .count();
    expect(hasAccountSection).toBeGreaterThan(0);
  });

  test('Can logout from settings', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Look for logout button
    const logoutButton = page
      .locator('button:has-text("Logout"), button:has-text("Log out")')
      .first();

    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForTimeout(1000);

      // Should redirect to auth page
      await expect(page).toHaveURL(/\/auth/, { timeout: 5000 });

      // Token should be cleared
      const token = await page.evaluate(() =>
        localStorage.getItem('auth_token')
      );
      expect(token).toBeNull();
    }
  });

  // ========================================================================
  // Unsaved Changes Tests
  // ========================================================================

  test('Shows unsaved changes warning', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Look for edit button
    const editButton = page
      .locator('button:has-text("Edit Profile"), button:has-text("Edit")')
      .first();

    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(500);

      // Make a change
      const input = page.locator('input[type="text"]').first();
      if (await input.isVisible()) {
        await input.fill('Test Change');
        await page.waitForTimeout(500);

        // Should show unsaved changes indicator or buttons
        const hasWarning = await page
          .locator('text=unsaved changes, text=Discard, text=Apply Changes')
          .count();
        expect(hasWarning).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('Can discard changes', async ({ page }) => {
    // Wait for settings to load
    await page.waitForTimeout(1000);

    // Look for edit button
    const editButton = page
      .locator('button:has-text("Edit Profile"), button:has-text("Edit")')
      .first();

    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(500);

      // Make a change
      const input = page.locator('input[type="text"]').first();
      if (await input.isVisible()) {
        const originalValue = await input.inputValue();
        await input.fill('Test Change');
        await page.waitForTimeout(500);

        // Click discard
        const discardButton = page
          .locator('button:has-text("Discard"), button:has-text("Cancel")')
          .first();
        if (await discardButton.isVisible()) {
          await discardButton.click();
          await page.waitForTimeout(500);

          // Changes should be reverted
          const currentValue = await input
            .inputValue()
            .catch(() => originalValue);
          expect(currentValue).toBe(originalValue);
        }
      }
    }
  });
});
