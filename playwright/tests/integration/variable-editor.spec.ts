import { test } from '@playwright/test';
import { VariableEditor } from '../pageobjects/VariableEditor';

let editor: VariableEditor;

test.beforeEach(async ({ page }) => {
  editor = await VariableEditor.openEngine(page, { directSave: true });
});

test.afterEach(async ({ page }) => {
  editor = await VariableEditor.openEngine(page, { directSave: true });
  const tree = editor.tree;
  await tree.expectNotEmpty();
  while ((await tree.rowCount()) > 4) {
    await tree.row(4).click();
    await editor.delete.click();
  }
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

test('save data', async () => {
  const tree = editor.tree;
  const details = editor.details;

  await tree.expectRowCount(4);

  await tree.row(2).click();
  await details.fill('appIdChanged', 'MyAppIdChanged', 'Your Azure Application (client) ID changed', 'Default');

  await tree.row(3).click();
  await details.fill('secretKeyChanged', 'MySecretKeyChanged', 'Secret key from your applications "certificates & secrets changed"', 'Password');

  const editor2 = await VariableEditor.openEngine(editor.page, { directSave: true });
  const tree2 = editor2.tree;
  const details2 = editor2.details;

  await tree2.row(2).click();
  await details2.expectValues('microsoft.connector', 'appIdChanged', 'MyAppIdChanged', 'Your Azure Application (client) ID changed', 'Default');
  await details2.fill('appId', 'MyAppId', 'Your Azure Application (client) ID', '');

  await tree2.row(3).click();
  await details2.expectValues('microsoft.connector', 'secretKeyChanged', 'MySecretKeyChanged', 'Secret key from your applications "certificates & secrets changed"', 'Password');
  await details2.fill('secretKey', 'MySecretKey', 'Secret key from your applications "certificates & secrets"', 'Password');

  const editor3 = await VariableEditor.openEngine(editor.page, { directSave: true });
  const tree3 = editor3.tree;
  const details3 = editor3.details;

  await tree3.row(2).click();
  await details3.expectValues('microsoft.connector', 'appId', 'MyAppId', 'Your Azure Application (client) ID', 'Default');

  await tree3.row(3).click();
  await details3.expectValues('microsoft.connector', 'secretKey', 'MySecretKey', 'Secret key from your applications "certificates & secrets"', 'Password');
});
