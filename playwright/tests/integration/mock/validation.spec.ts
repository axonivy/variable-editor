import test, { expect } from '@playwright/test';
import { VariableEditor } from '../../pageobjects/VariableEditor';
import { consoleLog } from '../../pageobjects/console-log';

let editor: VariableEditor;

test.beforeEach(async ({ page }) => {
  editor = await VariableEditor.openMock(page);
});

test('tree', async ({ page }) => {
  await expect(editor.tree.messages).toHaveCount(0);

  await editor.addVariable('invalidVariable0', 'invalidKey');
  await editor.addVariable('invalidVariable1', 'invalidKey');
  await expect(editor.tree.messages).toHaveCount(3);

  await editor.tree.row(11).expectToHaveWarning();
  const keyMessage = editor.tree.message(0);
  await keyMessage.expectToBeWarning('Invalid key');
  await keyMessage.expectToHaveReference('INVALID_KEY');

  await editor.tree.row(12).expectToHaveError();
  const valueWarning = editor.tree.message(1);
  await valueWarning.expectToBeWarning('Invalid variable 0 value warning');
  await valueWarning.expectToHaveReference('INVALID_VARIABLE_0_VALUE_WARNING');
  await editor.tree.message(2).expectToBeError('Invalid variable 0 value error');
  const actionLog = consoleLog(page);
  await keyMessage.reference.click();
  expect(await actionLog).toContain('"payload":"https://example.com/validation/invalid-key"');

  await editor.tree.row(13).expectToHaveNoValidation();
});

test('detail', async ({ page }) => {
  await editor.addVariable('invalidVariable0', 'invalidKey');
  await editor.addVariable('invalidVariable1', 'invalidKey');

  await editor.tree.row(11).click();
  const nameMessage = await editor.details.name.message();
  await nameMessage.expectToBeWarning('Invalid key');
  await nameMessage.expectToHaveReference('INVALID_KEY');
  const actionLog = consoleLog(page);
  await nameMessage.reference.click();
  expect(await actionLog).toContain('"payload":"https://example.com/validation/invalid-key"');

  await editor.tree.row(12).click();
  await nameMessage.expectToBeInfo('Invalid variable 0 key');
  const valueMessage = await editor.details.value.message();
  await valueMessage.expectToBeError('Invalid variable 0 value error');

  await editor.tree.row(13).click();
  await valueMessage.expectToBeInfo('Invalid variable 1 value');
});
