import { test, expect } from '@playwright/test';

// ============================================================================
// Test Data
// ============================================================================

const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
};

const existingUser = {
  email: 'santiagodrm@gmail.com',
  password: 'password',
};

// ============================================================================
// Authentication Flow Tests
// ============================================================================

test.describe('Authentication Flow', () => {
  // ========================================================================
  // User Registration Tests
  // ========================================================================

  test('User can register new account', async ({ page }) => {
    // Navigate to auth page
    await page.goto('/auth');

    // Wait for page to load
    await expect(page.locator('h2')).toContainText('Welcome Back');

    // Click register tab
    await page.click('text=Register');

    // Wait for register form
    await expect(page.locator('h2')).toContainText('Create an Account');

    // Fill registration form
    await page.fill('input[id="firstName"]', testUser.firstName);
    await page.fill('input[id="lastName"]', testUser.lastName);
    await page.fill('input[id="register-email"]', testUser.email);
    await page.fill('input[id="register-password"]', testUser.password);
    await page.fill('input[id="register-confirm-password"]', testUser.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for success message
    await expect(
      page.locator('text=Account created successfully! You can now log in.')
    ).toBeVisible({ timeout: 10000 });

    // Should stay on auth page after registration
    await expect(page).toHaveURL(/\/auth/);
  });

  // ========================================================================
  // User Login Tests
  // ========================================================================

  test('User can login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth');

    // Wait for login form
    await expect(page.locator('h2')).toContainText('Welcome Back');

    // Fill login form with credentials
    await page.fill('input[id="login-email"]', existingUser.email);
    await page.fill('input[id="login-password"]', existingUser.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to home page
    await expect(page).toHaveURL(/\/home/, { timeout: 10000 });

    // Verify user is authenticated by checking for protected content
    await expect(page.locator('h2').first()).toContainText('Dashboard');

    // Verify token is stored in localStorage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeTruthy();
  });

  // ========================================================================
  // Login Validation Tests
  // ========================================================================

  test('Login fails with invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth');

    // Wait for login form
    await expect(page.locator('h2')).toContainText('Welcome Back');

    // Fill with invalid credentials
    await page.fill('input[id="login-email"]', 'invalid@example.com');
    await page.fill('input[id="login-password"]', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(
      page.locator('.bg-error-background, .text-red-600, .text-error-text')
    ).toBeVisible({ timeout: 5000 });

    // Should stay on auth page
    await expect(page).toHaveURL(/\/auth/);

    // Should not have token in localStorage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeNull();
  });

  // ========================================================================
  // User Logout Tests
  // ========================================================================

  test('User can logout', async ({ page }) => {
    // First, login
    await page.goto('/auth');
    await expect(page.locator('h2')).toContainText('Welcome Back');
    await page.fill('input[id="login-email"]', existingUser.email);
    await page.fill('input[id="login-password"]', existingUser.password);
    await page.click('button[type="submit"]');

    // Wait for home page
    await expect(page).toHaveURL(/\/home/, { timeout: 10000 });

    // Verify token exists
    let token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeTruthy();

    /*     // Click settings/user menu (adjust selector based on your UI)
    await page.click(
      '[aria-label="Settings"], [data-testid="user-menu"], button:has-text("Settings")'
    );
 */
    // Click logout button
    await page.click(
      'button:has-text("Log out"), [data-testid="logout-button"]'
    );

    // Should redirect to auth page
    await expect(page).toHaveURL(/\/auth/, { timeout: 5000 });

    // Token should be removed from localStorage
    token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeNull();

    // Should show login form
    await expect(page.locator('h2')).toContainText('Welcome Back');
  });
});
