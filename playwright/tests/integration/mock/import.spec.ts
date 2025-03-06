import { expect, test } from '@playwright/test';
import { describe } from 'node:test';
import { VariableEditor } from '../../pageobjects/VariableEditor';

let editor: VariableEditor;

test.beforeEach(async ({ page }) => {
  editor = await VariableEditor.openMock(page);
});

describe('importAndOverwrite', () => {
  test('password', async () => {
    await editor.tree.expectRowCount(11);

    const overwrite = editor.overwrite;
    await overwrite.open();
    const variables = overwrite.variables;
    await variables.cell(0, 0).expectValue('Amazon');
    await variables.cell(1, 0).expectValue('ComprehendAmazon comprehend connector settings');
    await variables.cell(1, 0).expand();
    await variables.cell(2, 0).expectValue('SecretKeySecret key to access amazon comprehend');
    await variables.row(2).click();
    await overwrite.importBtn.click();
    await expect(overwrite.dialog).toBeHidden();

    const details = editor.details;
    await details.expectValues('Amazon.Comprehend', 'SecretKey', '<YOUR_SECRET_KEY>', 'Secret key to access amazon comprehend', 'Password');
  });

  test('enum has values', async () => {
    await editor.overwrite.open();
    await editor.overwrite.variables.row(2).expand();
    await editor.overwrite.variables.row(3).click();
    await editor.overwrite.importBtn.click();
    await editor.details.listOfPossibleValues.expectValues('one', 'two', 'three');
  });

  test('file has extension', async () => {
    await editor.overwrite.open();
    await editor.overwrite.variables.row(2).expand();
    await editor.overwrite.variables.row(4).click();
    await editor.overwrite.importBtn.click();
    await editor.details.fileNameExtension.expectValue('json');
  });
});

test('importAndOverwriteWholeSubTree', async () => {
  const tree = editor.tree;
  await tree.expectRowCount(11);

  const overwrite = editor.overwrite;
  await overwrite.open();
  const variables = overwrite.variables;
  await variables.cell(0, 0).expectValue('Amazon');
  await variables.cell(1, 0).expectValue('ComprehendAmazon comprehend connector settings');
  await variables.row(1).click();
  await overwrite.importBtn.click();
  await expect(overwrite.dialog).toBeHidden();

  const details = editor.details;
  await details.expectFolderValues('Amazon', 'Comprehend', 'Amazon comprehend connector settings');
  await tree.expectRowCount(15);
  await tree.row(11).click();
  await details.expectFolderValues('', 'Amazon', '');
  await tree.row(13).click();
  await details.expectValues('Amazon.Comprehend', 'SecretKey', '<YOUR_SECRET_KEY>', 'Secret key to access amazon comprehend', 'Password');
  await tree.row(14).click();
  await details.expectValues('Amazon.Comprehend', 'AccessKey', '<YOUR_ACCESS_KEY>', 'Access key to access amazon comprehend', 'Default');
});

describe('disabledMetadataOfOverwrittenVariable', () => {
  test('enum', async () => {
    await editor.overwrite.open();
    await editor.overwrite.variables.row(2).click();
    await editor.overwrite.importBtn.click();
    await editor.tree.row(12).click();
    await expect(editor.details.metaData.locator).toBeDisabled();
    await editor.details.listOfPossibleValues.expectToBeDisabled();
  });

  test('file', async () => {
    await editor.overwrite.open();
    await editor.overwrite.variables.row(2).click();
    await editor.overwrite.importBtn.click();
    await editor.tree.row(13).click();
    await expect(editor.details.metaData.locator).toBeDisabled();
    await expect(editor.details.fileNameExtension.locator).toBeDisabled();
  });
});

test('import variable when manually adding a known variable', async () => {
  await editor.add.open.click();
  await editor.add.name.fill('Comprehend');
  await editor.add.namespace.fill('Amazon');

  await expect(editor.add.importMessage).toBeHidden();

  await editor.add.create.click();

  await expect(editor.add.importMessage).toBeVisible();

  await editor.add.create.click();

  await editor.details.expectFolderValues('Amazon', 'Comprehend', 'Amazon comprehend connector settings');
  await editor.tree.expectRowCount(15);
  await editor.tree.row(11).click();
  await editor.details.expectFolderValues('', 'Amazon', '');
  await editor.tree.row(13).click();
  await editor.details.expectValues('Amazon.Comprehend', 'SecretKey', '<YOUR_SECRET_KEY>', 'Secret key to access amazon comprehend', 'Password');
  await editor.tree.row(14).click();
  await editor.details.expectValues('Amazon.Comprehend', 'AccessKey', '<YOUR_ACCESS_KEY>', 'Access key to access amazon comprehend', 'Default');
});

test('keyboard', async () => {
  await expect(editor.overwrite.dialog).toBeHidden();
  await editor.page.keyboard.press('i');
  await expect(editor.overwrite.dialog).toBeVisible();
});
