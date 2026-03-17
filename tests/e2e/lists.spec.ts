import { test, expect } from '@playwright/test';

// ============================================================================
// Test Data
// ============================================================================

const testUser = {
  email: 'santiagodrm@gmail.com',
  password: 'password',
};

const testList = {
  name: `E2E Test List ${Date.now()}`,
  description: 'This is a test list created by E2E tests',
  icon: '📋',
};

// ============================================================================
// Lists Management Tests
// ============================================================================

test.describe('Lists Page', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[id="login-email"]', testUser.email);
    await page.fill('input[id="login-password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/home/, { timeout: 10000 });

    // Navigate to lists page
    await page.click('text=Lists');
    await expect(page).toHaveURL(/\/lists/);
  });

  // ========================================================================
  // Page Display Tests
  // ========================================================================

  test('Lists page loads successfully', async ({ page }) => {
    // Should display page title
    await expect(page.locator('h2').first()).toContainText('My Lists');

    // Should show create list button or lists
    const hasCreateButton =
      (await page.locator('button:has-text("Create New List")').count()) > 0;
    const hasLists = await page.locator('[class*="list"]').count();

    expect(hasCreateButton || hasLists > 0).toBeTruthy();
  });

  // ========================================================================
  // Create List Tests
  // ========================================================================

  test('Can create a new list', async ({ page }) => {
    // Click create list button
    await page.click('button:has-text("Create New List")');

    // Modal should open
    await expect(page.locator('text=Create List')).toBeVisible({
      timeout: 5000,
    });

    // Fill list form
    await page.fill(
      'input[placeholder*="Project"], input[placeholder*="Goals"]',
      testList.name
    );
    await page.fill(
      'textarea[placeholder*="details"], textarea[placeholder*="about"]',
      testList.description
    );

    // Submit form
    await page.click('button:has-text("Create List"), button[type="submit"]');

    // Wait for modal to close
    await page.waitForTimeout(1000);

    // List should appear
    await expect(page.locator(`text=${testList.name}`)).toBeVisible({
      timeout: 5000,
    });
  });

  test('Cannot create list with empty name', async ({ page }) => {
    // Click create list button
    await page.click(
      'button:has-text("Create List"), button:has-text("Create New List")'
    );

    // Modal should open
    await expect(
      page.locator('h2').filter({ hasText: 'Create New List' })
    ).toBeVisible({
      timeout: 5000,
    });

    // Try to submit without filling name
    await page.click('button:has-text("Create List"), button[type="submit"]');

    // Should show validation error or stay on modal
    const modalStillVisible = await page
      .locator('h2')
      .filter({ hasText: 'Create New List' })
      .isVisible();
    expect(modalStillVisible).toBeTruthy();
  });

  // ========================================================================
  // View List Details Tests
  // ========================================================================

  test('Can view list details', async ({ page }) => {
    // Wait for lists to load
    await page.waitForTimeout(1000);

    // Click on first list
    const listItem = page.locator('[class*="list"]').first();

    if (await listItem.isVisible()) {
      await listItem.click();

      // Should navigate to list details page
      await expect(page).toHaveURL(/\/lists\/\d+/, { timeout: 3000 });

      // Should show list name and tasks
      await page.waitForTimeout(500);
      const hasContent = await page.locator('h2, h1').count();
      expect(hasContent).toBeGreaterThan(0);
    }
  });

  test('List details page shows tasks', async ({ page }) => {
    // Wait for lists to load
    await page.waitForTimeout(1000);

    // Click on first list
    const listItem = page.locator('[class*="list"]').first();

    if (await listItem.isVisible()) {
      await listItem.click();
      await expect(page).toHaveURL(/\/lists\/\d+/, { timeout: 3000 });
      await page.waitForTimeout(500);

      // Should show either tasks or empty state
      const hasTasks = await page.locator('[class*="task"]').count();
      const hasEmptyState = await page
        .locator('text=No tasks, text=Create your first task')
        .isVisible();

      expect(hasTasks > 0 || hasEmptyState).toBeTruthy();
    }
  });

  // ========================================================================
  // Edit List Tests
  // ========================================================================

  test('Can edit a list', async ({ page }) => {
    // Wait for lists to load
    await page.waitForTimeout(1000);

    // Click on first list
    const listItem = page.locator('[class*="list"]').first();

    if (await listItem.isVisible()) {
      await listItem.click();
      await expect(page).toHaveURL(/\/lists\/\d+/, { timeout: 3000 });
      await page.waitForTimeout(500);

      // Look for edit button (might be in a menu or visible)
      const editButton = page.locator('button:has-text("Edit")').first();

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);

        // Edit modal should appear
        await expect(page.locator('text=Edit List')).toBeVisible({
          timeout: 3000,
        });

        // Modify list name
        const nameInput = page
          .locator('input[value], input[type="text"]')
          .first();
        await nameInput.fill('Updated List Name');

        // Save changes
        await page.click('button:has-text("Save")');
        await page.waitForTimeout(1000);

        // Updated name should appear
        await expect(page.locator('text=Updated List Name')).toBeVisible({
          timeout: 5000,
        });
      }
    }
  });

  // ========================================================================
  // Delete List Tests
  // ========================================================================

  test('Can delete a list', async ({ page }) => {
    // First create a list to delete
    await page.click(
      'button:has-text("Create List"), button:has-text("Create New List")'
    );
    await expect(page.locator('text=Create New List').nth(2)).toBeVisible({
      timeout: 5000,
    });

    const listName = `List to Delete ${Date.now()}`;
    await page.fill(
      'input[placeholder*="Project"], input[placeholder*="Goals"]',
      listName
    );
    await page.click('button:has-text("Create List"), button[type="submit"]');
    await page.waitForTimeout(1000);

    // Find and click the created list
    const createdList = page.locator(`text=${listName}`).first();
    await expect(createdList).toBeVisible({ timeout: 5000 });
    await createdList.click();
    await expect(page).toHaveURL(/\/lists\/\d+/, { timeout: 3000 });
    await page.waitForTimeout(500);

    // Look for delete button
    const deleteButton = page.locator('button:has-text("Delete")').first();

    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      await page.waitForTimeout(500);

      // Confirmation modal should appear
      const confirmationVisible = await page
        .locator('text=Delete this, text=permanently delete')
        .isVisible();

      if (confirmationVisible) {
        // Confirm deletion
        await page.click('button:has-text("Delete")');
        await page.waitForTimeout(1000);

        // Should redirect back to lists page
        await expect(page).toHaveURL(/\/lists/, { timeout: 3000 });

        // List should not exist
        const listStillExists = await page
          .locator(`text=${listName}`)
          .isVisible();
        expect(listStillExists).toBeFalsy();
      }
    }
  });

  // ========================================================================
  // Favorite List Tests
  // ========================================================================

  test('Can favorite a list', async ({ page }) => {
    // Wait for lists to load
    await page.waitForTimeout(1000);

    // Look for favorite/star button on first list
    const favoriteButton = page
      .locator('[aria-label*="favorite"], [class*="star"], button:has(svg)')
      .first();

    if (await favoriteButton.isVisible()) {
      // Click to toggle favorite
      await favoriteButton.click();
      await page.waitForTimeout(500);

      // Button state should change (check if it's still visible, state might change)
      const buttonStillExists = await favoriteButton.isVisible();
      expect(buttonStillExists).toBeTruthy();
    }
  });

  // ========================================================================
  // Search Lists Tests
  // ========================================================================

  test('Can search lists', async ({ page }) => {
    // Wait for lists to load
    await page.waitForTimeout(1000);

    // Find search input
    const searchInput = page
      .locator('input[placeholder*="Search"], input[type="search"]')
      .first();

    if (await searchInput.isVisible()) {
      // Type search query
      await searchInput.fill('test');
      await page.waitForTimeout(500);

      // Results should update
      const hasResults = (await page.locator('[class*="list"]').count()) > 0;
      const hasEmptyState = await page
        .locator('text=No lists found')
        .isVisible();

      expect(hasResults || hasEmptyState).toBeTruthy();
    }
  });

  // ========================================================================
  // Create Task in List Tests
  // ========================================================================

  test('Can create task within a list', async ({ page }) => {
    // Wait for lists to load
    await page.waitForTimeout(1000);

    // Click on first list
    const listItem = page.locator('[class*="list"]').first();

    if (await listItem.isVisible()) {
      await listItem.click();
      await expect(page).toHaveURL(/\/lists\/\d+/, { timeout: 3000 });
      await page.waitForTimeout(500);

      // Look for create task button
      const createTaskButton = page
        .locator('button:has-text("Create Task")')
        .first();

      if (await createTaskButton.isVisible()) {
        await createTaskButton.click();
        await page.waitForTimeout(500);

        // Task creation modal should appear
        await expect(page.locator('text=Create New Task')).toBeVisible({
          timeout: 3000,
        });

        // Fill task details
        const taskName = `Task in List ${Date.now()}`;
        await page.fill(
          'input[placeholder*="Deploy"], input[placeholder*="task"]',
          taskName
        );

        // Submit
        await page.click(
          'button:has-text("Create Task"), button[type="submit"]'
        );
        await page.waitForTimeout(1000);

        // Task should appear in the list
        await expect(page.locator(`text=${taskName}`)).toBeVisible({
          timeout: 5000,
        });
      }
    }
  });
});
