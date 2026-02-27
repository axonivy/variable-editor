import { expect, test } from '@playwright/test';
import type { Table } from '../../pageobjects/Table';
import { VariableEditor } from '../../pageobjects/VariableEditor';
import { consoleLog } from '../../pageobjects/console-log';

let editor: VariableEditor;
let tree: Table;

test.beforeEach(async ({ page }) => {
  editor = await VariableEditor.openMock(page);
  tree = editor.tree;
  await tree.expectRowCount(11);
});

test('title', async () => {
  await editor.toolbar.expectTitle('Variables Editor Mock');
});

test('search', async () => {
  const search = editor.search;

  await search.fill('Hello');
  await search.expectValue('Hello');
  await tree.expectRowCount(0);

  await search.fill('useUser');
  await search.expectValue('useUser');
  await tree.expectRowCount(5);
  await tree.cell(0, 0).expectValue('MicrosoftConnector');
  await tree.cell(1, 0).expectValue('UseUserPassFlow');
  await tree.cell(2, 0).expectValue('Enabled');
  await tree.cell(3, 0).expectValue('User');
  await tree.cell(4, 0).expectValue('Pass');
});

test.describe('delete', () => {
  test('delete', async () => {
    const row = tree.row(6);
    await row.click();
    await row.expectValues(['Enabled', 'false']);
    await row.expectSelected();

    await editor.delete.click();

    await tree.expectRowCount(10);
    await row.expectValues(['User', 'MyUser']);
    await row.expectSelected();
  });

  test('last child', async () => {
    const row = tree.row(8);
    await row.click();
    await row.expectValues(['Pass', '***']);
    await row.expectSelected();

    await editor.delete.click();

    await tree.expectRowCount(10);
    await row.column(0).expectValue('Permissions');
    await row.expectNotSelected();
    const previousRow = tree.row(7);
    await previousRow.expectValues(['User', 'MyUser']);
    await previousRow.expectSelected();
  });

  test('last remaining child', async () => {
    const row = tree.row(6);
    await row.click();
    await editor.delete.click();
    await editor.delete.click();
    await row.expectValues(['Pass', '***']);

    await editor.delete.click();

    await tree.expectRowCount(8);
    await row.column(0).expectValue('Permissions');
    await row.expectNotSelected();
    const parentRow = tree.row(5);
    await parentRow.expectValues(['UseUserPassFlow', '']);
    await parentRow.expectSelected();
  });

  test('keyboard', async () => {
    await tree.expectRowCount(11);
    await tree.row(6).click();
    await editor.page.keyboard.press('Delete');
    await tree.expectRowCount(10);
  });
});

test.describe('add', () => {
  test('add', async () => {
    await editor.addVariable('NewVariable', 'MicrosoftConnector.New.Namespace');
    await tree.expectRowCount(14);
    await tree.row(11).expectValues(['New', '']);
    await tree.row(12).expectValues(['Namespace', '']);
    await tree.row(13).expectValues(['NewVariable', '']);
  });

  test('dialog default values', async () => {
    await tree.row(5).click();
    await tree.row(5).expectValues(['UseUserPassFlow', '']);
    await editor.add.open.click();
    await editor.add.expectValues('NewVariable', 'MicrosoftConnector.UseUserPassFlow', 'MicrosoftConnector', 'MicrosoftConnector.UseUserPassFlow');
  });

  test('keyboard', async () => {
    await expect(editor.add.dialog).toBeHidden();
    await editor.page.keyboard.press('a');
    await editor.add.name.fill('keyboard');
    await editor.add.name.expectValue('keyboard');

    //check that it is not possible to open other dialogs via shortcut
    await editor.add.dialog.focus();
    await editor.page.keyboard.press('i');
    await expect(editor.overwrite.importBtn.locator).toBeHidden();

    await editor.add.name.locator.focus();
    await editor.page.keyboard.press('ControlOrMeta+Enter');
    await editor.add.name.expectValue('');
    await editor.add.name.fill('keyboard');
    await expect(editor.add.dialog).toBeVisible();
    await (await editor.add.name.message()).expectToBeError('Name is already present in this Namespace.');

    await editor.page.keyboard.press('Escape');
    await expect(editor.add.dialog).toBeHidden();
    await tree.row(11).expectValues(['keyboard', '']);
  });

  test('keyboard namespace', async () => {
    await expect(editor.add.dialog).toBeHidden();
    await editor.page.keyboard.press('a');
    await editor.add.name.fill('keyboard');
    await editor.add.name.expectValue('keyboard');

    await editor.add.namespace.locator.focus();
    await editor.page.keyboard.press('Enter');
    await expect(editor.add.namespace.options).toHaveCount(2);
    await editor.page.keyboard.press('ArrowDown');
    await editor.page.keyboard.press('Enter');
    await editor.add.namespace.expectValue('MicrosoftConnector.UseUserPassFlow');
    await editor.page.keyboard.press('Tab');
    await editor.page.keyboard.press('Tab');
    await editor.page.keyboard.press('Enter');

    await expect(editor.add.dialog).toBeHidden();
    await tree.row(9).expectValues(['keyboard', '']);
  });

  test.describe('validation', () => {
    test.describe('name', () => {
      test('onNameChange', async () => {
        const add = editor.add;
        await add.open.click();
        const nameMessage = await add.name.message();
        await nameMessage.expectToBeHidden();
        await expect(add.create.locator).toBeEnabled();
        await add.name.fill('');
        await nameMessage.expectToBeError('Name cannot be empty.');
        await expect(add.create.locator).toBeDisabled();
        await add.name.fill('MicrosoftConnector');
        await nameMessage.expectToBeError('Name is already present in this Namespace.');
        await expect(add.create.locator).toBeDisabled();
      });

      test('onNamespaceChange', async () => {
        const add = editor.add;
        await add.open.click();
        const nameMessage = await add.name.message();
        await add.name.fill('AppId');
        await nameMessage.expectToBeHidden();
        await expect(add.create.locator).toBeEnabled();
        await add.namespace.choose('MicrosoftConnector');
        await nameMessage.expectToBeError('Name is already present in this Namespace.');
        await expect(add.create.locator).toBeDisabled();
      });

      test('onNamespaceInput', async () => {
        const add = editor.add;
        await add.open.click();
        const nameMessage = await add.name.message();
        await add.name.fill('AppId');
        await nameMessage.expectToBeHidden();
        await expect(add.create.locator).toBeEnabled();
        await add.namespace.fill('MicrosoftConnector');
        await nameMessage.expectToBeError('Name is already present in this Namespace.');
        await expect(add.create.locator).toBeDisabled();
      });
    });

    test('namespace', async () => {
      const add = editor.add;
      await add.open.click();
      const namespaceMessage = await add.namespace.message();
      await namespaceMessage.expectToBeInfo("Folder structure of Variable (e.g. 'Connector.Key').");
      await expect(add.create.locator).toBeEnabled();
      await add.namespace.fill('MicrosoftConnector.AppId.New.Namespace');
      await namespaceMessage.expectToBeError("Namespace 'MicrosoftConnector.AppId' is not a folder, you cannot add a child to it.");
      await expect(add.create.locator).toBeDisabled();
    });
  });
});

test('collapse', async () => {
  const row = tree.row(5);
  await row.expectExpanded();
  await row.collapse();
  await row.expectCollapsed();
  await tree.expectRowCount(8);
});

test('expand', async () => {
  const row = tree.row(5);
  await row.collapse();
  await tree.expectRowCount(8);
  await row.expectCollapsed();
  await row.expand();
  await row.expectExpanded();
  await tree.expectRowCount(11);
});

test('password', async () => {
  await editor.tree.row(2).expectValues(['SecretKey', '***']);
});

test('help', async ({ page }) => {
  const msg1 = consoleLog(page);
  await editor.details.title.getByRole('button', { name: 'Open Help' }).click();
  expect(await msg1).toContain('openUrl');

  const msg2 = consoleLog(page);
  await page.keyboard.press('F1');
  expect(await msg2).toContain('openUrl');
  expect(await msg2).toContain('https://dev.axonivy.com');
});

test('focus jumps', async ({ page }) => {
  await page.keyboard.press('1');
  await expect(editor.toolbar.locator).toBeFocused();
  await page.keyboard.press('2');
  await expect(editor.locator.locator('.ui-fieldset')).toBeFocused();
  await page.keyboard.press('3');
  await expect(editor.details.title).toBeFocused();
});

test('undo / redo', async ({ page, browserName }) => {
  await expect(editor.toolbar.undo).toBeDisabled();
  await expect(editor.toolbar.redo).toBeDisabled();
  await editor.tree.row(5).click();
  await editor.tree.expectRowCount(11);
  await page.keyboard.press('Delete');
  await editor.tree.expectRowCount(7);

  await expect(editor.toolbar.undo).toBeEnabled();
  await editor.toolbar.undo.click();
  await editor.tree.expectRowCount(11);
  await expect(editor.toolbar.undo).toBeDisabled();

  await expect(editor.toolbar.redo).toBeEnabled();
  await editor.toolbar.redo.click();
  await editor.tree.expectRowCount(7);
  await expect(editor.toolbar.redo).toBeDisabled();

  await page.keyboard.press('ControlOrMeta+Z');
  await editor.tree.expectRowCount(11);

  await page.keyboard.press(browserName === 'webkit' ? 'ControlOrMeta+Shift+Z' : 'ControlOrMeta+Y');
  await editor.tree.expectRowCount(7);
});
