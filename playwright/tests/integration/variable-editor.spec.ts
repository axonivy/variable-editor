import { test } from '@playwright/test';
import { VariableEditor } from '../pageobjects/VariableEditor';

let editor: VariableEditor;

test.beforeEach(async ({ page }) => {
  editor = await VariableEditor.openVariables(page);
});

test('title', async () => {
  await editor.toolbar.expectTitle('Variables Editor');
});

test('validation', async () => {
  const tree = editor.tree;
  await tree.expectRowCount(4);

  await editor.addVariable();
  const row = editor.tree.row(4);
  await row.expectToHaveNoValidation();

  await editor.details.name.fill('hello.world');
  await row.expectToHaveWarning();

  await editor.details.name.fill('hello');
  await row.expectToHaveNoValidation();
});

test('load data', async () => {
  const tree = editor.tree;
  const details = editor.details;

  await tree.expectRowCount(4);

  await tree.row(0).click();
  await details.expectFolderValues('', 'microsoft', '');

  await tree.row(1).click();
  await details.expectFolderValues('microsoft', 'connector', '');

  await tree.row(2).click();
  await details.expectValues('microsoft.connector', 'appId', 'MyAppId', 'Your Azure Application (client) ID', 'Default');

  await tree.row(3).click();
  await details.expectValues('microsoft.connector', 'secretKey', 'MySecretKey', 'Secret key from your applications "certificates & secrets"', 'Password');
});

test('save data', async ({ page }) => {
  editor = await VariableEditor.openNewVariables(page, { directSave: true });

  const tree = editor.tree;
  const details = editor.details;

  await tree.expectEmpty();

  await editor.addVariable('myVar', 'my.name.space');

  editor.page.reload();

  await tree.expectRowCount(4);

  await tree.row(3).click();
  await details.fill('myVarChanged', 'myValue', 'myDescription', 'Password');

  editor.page.reload();

  await tree.row(3).click();
  await details.expectValues('my.name.space', 'myVarChanged', 'myValue', 'myDescription', 'Password');
});
