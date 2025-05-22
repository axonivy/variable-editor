import { expect, test } from '@playwright/test';
import { VariableEditor } from '../pageobjects/VariableEditor';

test('normal', async ({ page }) => {
  const editor = await VariableEditor.openEngine(page);
  await expect(editor.add.open.locator).toBeVisible();
  await expect(editor.overwrite.overwrite.locator).toBeVisible();
  await expect(editor.delete.locator).toBeVisible();
});

test('readonly', async ({ page }) => {
  const editor = await VariableEditor.openEngine(page, { readonly: true });
  await expect(editor.add.open.locator).toBeHidden();
  await page.keyboard.press('a');
  await expect(editor.add.dialog).toBeHidden();

  await expect(editor.overwrite.overwrite.locator).toBeHidden();
  await page.keyboard.press('i');
  await expect(editor.overwrite.dialog).toBeHidden();

  await editor.tree.expectRowCount(4);
  await editor.tree.row(0).locator.click();
  await editor.tree.expectToBeSelected(0);
  await expect(editor.delete.locator).toBeHidden();
  await page.keyboard.press('Delete');
  await editor.tree.expectRowCount(4);

  await expect(editor.toolbar.undo).toBeHidden();
  await expect(editor.toolbar.redo).toBeHidden();
});
