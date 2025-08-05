import { expect, test } from '@playwright/test';
import { VariableEditor } from '../../pageobjects/VariableEditor';

let editor: VariableEditor;

test.beforeEach(async ({ page }) => {
  editor = await VariableEditor.openMock(page);
  await editor.tree.row(0).click();
  await editor.delete.click();
  await page.getByText('Add your first variable to').click();
});

test.describe('start Page', () => {
  test('start page Add variable', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Variable' }).click();
    await expect(page.getByRole('dialog', { name: 'Add Variable' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await editor.page.keyboard.press('A');
    await expect(page.getByRole('dialog', { name: 'Add Variable' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('start page import variable', async ({ page }) => {
    await page.getByRole('button', { name: 'Import Variable' }).click();
    await expect(page.getByRole('dialog', { name: 'Import Variable' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await editor.page.keyboard.press('I');
    await expect(page.getByRole('dialog', { name: 'Import Variable' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });
});
