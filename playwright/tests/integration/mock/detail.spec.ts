import { expect, test } from '@playwright/test';
import { VariableEditor } from '../../pageobjects/VariableEditor';

let editor: VariableEditor;

test.beforeEach(async ({ page }) => {
  editor = await VariableEditor.openMock(page);
});

test('new text variable', async () => {
  await editor.tree.row(0).click();
  await editor.addVariable();
  await editor.tree.row(11).click();
  const details = editor.details;
  await details.expectTitle('Variable - NewVariable');

  await details.fill('myName', 'myValue', 'This is myName with a value of myValue');

  await details.expectValues('microsoft-connector', 'myName', 'myValue', 'This is myName with a value of myValue', 'Default');
  await details.expectTitle('Variable - myName');
  await editor.tree.row(11).expectValues(['myName', 'myValue']);
  await editor.tree.row(10).click();
  await details.expectTitle('Variable - connectorProvider');
  await editor.tree.row(11).click();

  await details.expectTitle('Variable - myName');
  await details.expectValues('microsoft-connector', 'myName', 'myValue', 'This is myName with a value of myValue', 'Default');
});

test('new password variable', async () => {
  await editor.tree.row(0).click();
  await editor.addVariable();
  await editor.tree.row(11).click();
  const details = editor.details;
  await details.expectTitle('Variable - NewVariable');

  await details.fill('myName', 'myValue', 'This is myName with a value of myValue', 'Password');

  await details.expectValues('microsoft-connector', 'myName', 'myValue', 'This is myName with a value of myValue', 'Password');
  await details.expectTitle('Variable - myName');
  await editor.tree.row(11).expectValues(['myName', '***']);
  await editor.tree.row(10).click();
  await details.expectTitle('Variable - connectorProvider');
  await editor.tree.row(11).click();

  await details.expectTitle('Variable - myName');
  await details.expectValues('microsoft-connector', 'myName', 'myValue', 'This is myName with a value of myValue', 'Password');
});

test('new daytime variable', async () => {
  await editor.tree.row(0).click();
  await editor.addVariable();
  await editor.tree.row(11).click();
  const details = editor.details;
  await details.expectTitle('Variable - NewVariable');

  await details.fill('myName', '12:15', 'This is myName with a value of myValue', 'Daytime');

  await details.expectValues('microsoft-connector', 'myName', '12:15', 'This is myName with a value of myValue', 'Daytime');
  await details.expectTitle('Variable - myName');
  await editor.tree.row(11).expectValues(['myName', '12:15']);
  await editor.tree.row(10).click();
  await details.expectTitle('Variable - connectorProvider');
  await editor.tree.row(11).click();

  await details.expectTitle('Variable - myName');
  await details.expectValues('microsoft-connector', 'myName', '12:15', 'This is myName with a value of myValue', 'Daytime');
});

test('new file variable', async () => {
  await editor.tree.row(0).click();
  await editor.addVariable();
  await editor.tree.row(11).click();
  const details = editor.details;
  await details.expectTitle('Variable - NewVariable');

  await details.fill('myName', '', 'This is myName with a value of myValue', 'File');
  await details.fileNameExtension.choose('txt');

  await details.expectValues('microsoft-connector', 'myName', '', 'This is myName with a value of myValue', 'File');
  await details.fileNameExtension.expectValue('txt');
  await details.expectTitle('Variable - myName');
  await editor.tree.row(11).expectValues(['myName', '']);
  await editor.tree.row(10).click();
  await details.expectTitle('Variable - connectorProvider');
  await editor.tree.row(11).click();

  await details.expectTitle('Variable - myName');
  await details.expectValues('microsoft-connector', 'myName', '', 'This is myName with a value of myValue', 'File');
  await details.fileNameExtension.expectValue('txt');
});

test('new enum variable', async () => {
  await editor.tree.row(0).click();
  await editor.addVariable();
  await editor.tree.row(11).click();
  const details = editor.details;
  await details.expectTitle('Variable - NewVariable');

  await details.fill('myName', 'Monday', 'This is myName with a value of Monday', 'Enum');

  await details.expectValues('microsoft-connector', 'myName', 'Monday', 'This is myName with a value of Monday', 'Enum');
  await details.listOfPossibleValues.expectValues('Monday');
  await details.expectTitle('Variable - myName');
  await editor.tree.row(11).expectValues(['myName', 'Monday']);
  await editor.tree.row(10).click();
  await details.expectTitle('Variable - connectorProvider');
  await editor.tree.row(11).click();

  await details.expectTitle('Variable - myName');
  await details.expectValues('microsoft-connector', 'myName', 'Monday', 'This is myName with a value of Monday', 'Enum');
  await details.listOfPossibleValues.expectValues('Monday');
});

test('add/delete enum variable', async () => {
  await editor.tree.row(0).click();
  await editor.addVariable();
  await editor.tree.row(11).click();
  const details = editor.details;

  await details.fill('myName', 'Monday', 'This is myName with a value of Monday', 'Enum');
  await details.listOfPossibleValues.addValue('Tuesday');
  await details.listOfPossibleValues.addValue('Wednesday');

  await details.listOfPossibleValues.expectValues('Monday', 'Tuesday', 'Wednesday');

  await details.enumValue.choose('Tuesday');
  await details.enumValue.expectValue('Tuesday');

  await details.enumValue.choose('Wednesday');
  await details.enumValue.expectValue('Wednesday');

  await details.enumValue.choose('Monday');

  await details.listOfPossibleValues.deleteValue('Tuesday');
  await details.listOfPossibleValues.deleteValue('Wednesday');

  await details.listOfPossibleValues.expectValues('Monday');
});

test('edit name', async () => {
  await editor.tree.row(0).click();
  await editor.tree.row(0).expectValues(['microsoft-connector', '']);
  const details = editor.details;
  await details.name.expectValue('microsoft-connector');

  await details.name.fill('Gugus');

  await editor.tree.row(1).click();
  await editor.tree.row(0).click();
  await editor.tree.row(0).expectValues(['Gugus', '']);
  await details.name.expectValue('Gugus');
});

test('edit value', async () => {
  await editor.tree.row(1).click();
  await editor.tree.row(1).expectValues(['appId', 'MyAppId']);
  const details = editor.details;
  await details.value.expectValue('MyAppId');

  await details.value.fill('Gugus');

  await editor.tree.row(0).click();
  await editor.tree.row(1).click();
  await editor.tree.row(1).expectValues(['appId', 'Gugus']);
  await details.value.expectValue('Gugus');
});

test('edit description', async () => {
  await editor.tree.row(1).click();
  await editor.tree.row(1).expectValues(['appId', 'MyAppId']);
  const details = editor.details;
  await details.description.expectValue('Your Azure Application (client) ID');

  await details.description.fill('Gugus');

  await editor.tree.row(0).click();
  await editor.tree.row(1).click();
  await editor.tree.row(1).expectValues(['appId', 'MyAppId']);
  await details.description.expectValue('Gugus');
});

test('edit metadata', async () => {
  await editor.tree.row(2).click();
  await editor.tree.row(2).expectValues(['secretKey', '***']);
  const details = editor.details;
  await details.metaData.expectValue('Password');

  await details.metaData.choose('Default');

  await editor.tree.row(0).click();
  await editor.tree.row(2).click();
  await editor.tree.row(2).expectValues(['secretKey', 'MySecretKey']);
  await details.metaData.expectValue('Default');
});

test('show password', async () => {
  await editor.tree.row(2).click();
  await editor.tree.row(2).expectValues(['secretKey', '***']);
  const details = editor.details;
  await details.value.expectType('password');
  await details.value.showPassword.click();
  await details.value.expectType('text');
  await details.value.showPassword.click();
  await details.value.expectType('password');
});

test('empty details', async () => {
  await expect(editor.details.locator.locator('p')).toHaveText('Select a Variable to edit its properties.');
});

test('toogle details', async () => {
  await expect(editor.masterPanel).toHaveAttribute('data-panel-size', '75.0');
  await editor.toolbar.detailsToggle.click();
  await expect(editor.masterPanel).toHaveAttribute('data-panel-size', '1.0');
  await editor.toolbar.detailsToggle.click();
  await expect(editor.masterPanel).toHaveAttribute('data-panel-size', '75.0');
});

test('delete selected', async () => {
  await editor.tree.row(1).click();
  await editor.tree.row(1).expectValues(['appId', 'MyAppId']);
  const details = editor.details;
  await details.expectTitle('Variable - appId');
  await details.expectValues('microsoft-connector', 'appId', 'MyAppId', 'Your Azure Application (client) ID', 'Default');

  await editor.delete.click();

  await editor.tree.row(1).expectValues(['secretKey', '***']);
  await details.expectValues('microsoft-connector', 'secretKey', 'MySecretKey', 'Secret key from your applications "certificates & secrets"', 'Password');
});

test('add existing', async () => {
  await editor.tree.row(0).click();
  await editor.addVariable();
  await editor.tree.expectRowCount(12);

  const details = editor.details;
  await details.name.fill('appId');

  await editor.tree.expectRowCount(12);
});
