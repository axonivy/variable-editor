import { expect, type Locator, type Page } from '@playwright/test';
import { EnumValues } from './EnumValues';
import { Select } from './Select';
import { TextArea } from './TextArea';

export class Details {
  readonly locator: Locator;
  readonly title: Locator;
  readonly namespace: TextArea;
  readonly name: TextArea;
  readonly value: TextArea;
  readonly enumValue: Select;
  readonly description: TextArea;
  readonly metaData: Select;
  readonly fileNameExtension: Select;
  readonly listOfPossibleValues: EnumValues;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.locator('.variables-editor-detail-panel');
    this.title = this.locator.locator('.variables-editor-detail-header');
    this.name = new TextArea(this.locator, { label: 'Name' });
    this.namespace = new TextArea(this.locator, { label: 'Namespace' });
    this.value = new TextArea(this.locator, { label: 'Value' });
    this.enumValue = new Select(page, this.locator, { label: 'Value' });
    this.description = new TextArea(this.locator, { label: 'Description' });
    this.metaData = new Select(page, this.locator, { label: 'Metadata' });
    this.fileNameExtension = new Select(page, this.locator, { label: 'Filename extension' });
    this.listOfPossibleValues = new EnumValues(page, this.locator);
  }

  async expectTitle(t: string) {
    await expect(this.title).toHaveText(t);
  }

  async fill(name: string, value: string, description: string, metaData?: string) {
    await this.name.fill(name);
    await this.description.fill(description);
    if (metaData) {
      await this.metaData.choose(metaData);
      if (metaData === 'Enum') {
        await this.listOfPossibleValues.setFirstValue(value);
        await this.enumValue.choose(value);
        return;
      }
      if (metaData === 'File') {
        await this.value.expectDisabled();
        return;
      }
    }
    await this.value.fill(value);
  }

  async expectValues(namespace: string, name: string, value: string, description: string, metaData: string) {
    await this.namespace.expectValue(namespace);
    await this.name.expectValue(name);
    if (metaData === 'Enum') {
      await this.enumValue.expectValue(value);
    } else if (metaData === 'File') {
      await this.value.expectDisabled();
    } else {
      await this.value.expectValue(value);
    }
    await this.description.expectValue(description);
    await this.metaData.expectValue(metaData);
    switch (metaData) {
      case 'Password':
        await this.value.expectType('password');
        break;
      case 'Daytime':
        await this.value.expectType('time');
        break;
      case 'Enum':
      case 'File':
        break;
      default:
        await this.value.expectNoType();
    }
  }

  async expectFolderValues(namespace: string, name: string, description: string) {
    await this.namespace.expectValue(namespace);
    await this.name.expectValue(name);
    await this.description.expectValue(description);
    await this.value.expectDoesNotExists();
    await this.metaData.expectDoesNotExists();
  }
}
