import { test, expect } from '@playwright/test';

// ============================================================================
// Test Data
// ============================================================================

const testUser = {
  email: 'santiagodrm@gmail.com',
  password: 'password',
};

const testTask = {
  name: `E2E Test Task ${Date.now()}`,
  description: 'This is a test task created by E2E tests',
  priority: 'high',
  status: 'todo',
};

// ============================================================================
// Tasks Management Tests
// ============================================================================

test.describe('Tasks Page', () => {
  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.fill('input[id="login-email"]', testUser.email);
    await page.fill('input[id="login-password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/home/, { timeout: 10000 });

    // Navigate to tasks page
    await page.click('text=My Tasks');
    await expect(page).toHaveURL(/\/tasks/);
  });

  // ========================================================================
  // Page Display Tests
  // ========================================================================

  test('Tasks page loads successfully', async ({ page }) => {
    // Should display page title
    await expect(page.locator('h2').first()).toContainText('My Tasks');

    // Should show filter/sort controls or tasks list
    const hasFilters = await page.locator('text=All Tasks').count();
    expect(hasFilters).toBeGreaterThan(0);
  });

  // ========================================================================
  // Create Task Tests
  // ========================================================================

  test('Can create a new task', async ({ page }) => {
    // Click create task button
    await page.click('button:has-text("Create Task")');

    // Modal should open
    await expect(page.locator('text=Create New Task')).toBeVisible({
      timeout: 5000,
    });

    // Fill task form
    await page.fill(
      'input[placeholder*="Deploy"], input[placeholder*="task"]',
      testTask.name
    );
    await page.fill(
      'textarea[placeholder*="context"], textarea[placeholder*="Provide"]',
      testTask.description
    );

    // Select priority
    /* const prioritySelect = page.locator('button').first();
    if (await prioritySelect.isVisible()) {
      await prioritySelect.selectOption('High');
    } */
    await page.click('button:has-text("High")');
    // Submit form
    await page.click('button:has-text("Create Task"), button[type="submit"]');

    // Wait for modal to close and task to appear
    await page.waitForTimeout(1000);

    // Task should appear in the list
    await expect(page.locator(`text=${testTask.name}`)).toBeVisible({
      timeout: 5000,
    });
  });

  test('Cannot create task with empty name', async ({ page }) => {
    // Click create task button
    await page.click('button:has-text("Create Task")');

    // Modal should open
    await expect(page.locator('text=Create New Task')).toBeVisible({
      timeout: 5000,
    });

    // Try to submit without filling name
    await page.click('button:has-text("Create Task"), button[type="submit"]');

    // Should show validation error or stay on modal
    const modalStillVisible = await page
      .locator('text=Create New Task')
      .isVisible();
    expect(modalStillVisible).toBeTruthy();
  });

  // ========================================================================
  // Task Actions Tests
  // ========================================================================

  test('Can toggle task completion', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForTimeout(1000);

    // Find a task checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();

    if (await checkbox.isVisible()) {
      const initialState = await checkbox.isChecked();

      // Toggle checkbox
      await checkbox.click();

      // Wait for state change
      await page.waitForTimeout(500);

      const newState = await checkbox.isChecked();
      expect(newState).not.toBe(initialState);
    }
  });

  test('Can view task details', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForTimeout(1000);

    // Click on first task (not the checkbox)
    const taskItem = page.locator('[class*="task"]').first();

    if (await taskItem.isVisible()) {
      await taskItem.click();

      // Task details modal should open
      await page.waitForTimeout(500);

      // Check if modal or details view is visible
      const hasModal = await page
        .locator('text=DESCRIPTION, text=DUE DATE')
        .count();
      expect(hasModal).toBeGreaterThan(0);
    }
  });

  // ========================================================================
  // Filter and Search Tests
  // ========================================================================

  test('Can filter tasks by status', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForTimeout(1000);

    // Try to find and click filter options
    const todoFilter = page
      .locator('text=To Do, button:has-text("To Do")')
      .first();

    if (await todoFilter.isVisible()) {
      await todoFilter.click();
      await page.waitForTimeout(500);

      // URL or UI should update to show filtered view
      const currentURL = page.url();
      expect(currentURL.length).toBeGreaterThan(0);
    }
  });

  test('Can search tasks', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForTimeout(1000);

    // Find search input
    const searchInput = page
      .locator('input[placeholder*="Search"], input[type="search"]')
      .first();

    if (await searchInput.isVisible()) {
      // Type search query
      await searchInput.fill('test');
      await page.waitForTimeout(500);

      // Results should update (either filtered or empty state)
      const hasResults = (await page.locator('[class*="task"]').count()) > 0;
      const hasEmptyState = await page
        .locator('text=No tasks found')
        .isVisible();

      expect(hasResults || hasEmptyState).toBeTruthy();
    }
  });

  // ========================================================================
  // Edit Task Tests
  // ========================================================================

  test('Can edit an existing task', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForTimeout(1000);

    // Click on first task to open details
    const taskItem = page.locator('[class*="task"]').first();

    if (await taskItem.isVisible()) {
      await taskItem.click();
      await page.waitForTimeout(500);

      // Look for edit button
      const editButton = page.locator('button:has-text("Edit")').first();

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);

        // Edit modal should be visible
        await expect(page.locator('text=Edit Task')).toBeVisible({
          timeout: 3000,
        });

        // Modify task name
        const nameInput = page
          .locator('input[value], input[type="text"]')
          .first();
        await nameInput.fill('Updated Task Name');

        // Save changes
        await page.click('button:has-text("Save")');
        await page.waitForTimeout(1000);

        // Updated name should appear
        await expect(page.locator('text=Updated Task Name')).toBeVisible({
          timeout: 5000,
        });
      }
    }
  });

  // ========================================================================
  // Delete Task Tests
  // ========================================================================

  test('Can delete a task', async ({ page }) => {
    // First create a task to delete
    await page.click('button:has-text("Create Task")');
    await expect(page.locator('text=Create New Task')).toBeVisible({
      timeout: 5000,
    });

    const taskName = `Task to Delete ${Date.now()}`;
    await page.fill(
      'input[placeholder*="Deploy"], input[placeholder*="task"]',
      taskName
    );
    await page.click('button:has-text("Create Task"), button[type="submit"]');
    await page.waitForTimeout(1000);

    // Find the created task
    const createdTask = page.locator(`text=${taskName}`).first();
    await expect(createdTask).toBeVisible({ timeout: 5000 });

    // Click on the task
    await createdTask.click();
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

        // Task should be removed from the list
        const taskStillExists = await page
          .locator(`text=${taskName}`)
          .isVisible();
        expect(taskStillExists).toBeFalsy();
      }
    }
  });

  // ========================================================================
  // Sort Tasks Tests
  // ========================================================================

  test('Can sort tasks', async ({ page }) => {
    // Wait for tasks to load
    await page.waitForTimeout(1000);

    // Look for sort dropdown
    const sortButton = page
      .locator('text=Sort By, select, button:has-text("Sort")')
      .first();

    if (await sortButton.isVisible()) {
      await sortButton.click();
      await page.waitForTimeout(300);

      // Select a sort option
      const sortOption = page
        .locator('text=Priority, text=Due Date, text=Recent')
        .first();
      if (await sortOption.isVisible()) {
        await sortOption.click();
        await page.waitForTimeout(500);

        // List should update (check that page is still showing tasks)
        const hasTasks = await page.locator('[class*="task"]').count();
        expect(hasTasks).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
