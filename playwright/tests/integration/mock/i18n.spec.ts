import { expect, test } from '@playwright/test';
import { VariableEditor } from '../../pageobjects/VariableEditor';

test('english translation', async ({ page }) => {
  const editor = await VariableEditor.openMock(page);
  await expect(editor.toolbar.locator).toContainText('Variables - ');
});

test('german translation', async ({ page }) => {
  const editor = await VariableEditor.openMock(page, { lng: 'de' });
  await expect(editor.toolbar.locator).toContainText('Variablen - ');
});
