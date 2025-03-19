import { type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { Combobox } from './Combobox';
import { TextArea } from './TextArea';

export class AddVariableDialog {
  readonly open: Button;
  readonly dialog: Locator;
  readonly name: TextArea;
  readonly namespace: Combobox;
  readonly importMessage: Locator;
  readonly create: Button;

  constructor(
    page: Page,
    readonly parent: Locator
  ) {
    this.open = new Button(parent, { name: 'Add Variable' });
    this.dialog = parent.getByRole('dialog');
    this.name = new TextArea(this.dialog);
    this.namespace = new Combobox(page, this.dialog);
    this.importMessage = this.dialog.locator('.import-message');
    this.create = new Button(this.dialog, { name: 'Create Variable' });
  }

  async expectValues(name: string, namespaceValue: string, ...namespaceOptions: Array<string>) {
    await this.name.expectValue(name);
    await this.namespace.expectValue(namespaceValue);
    await this.namespace.expectOptions(...namespaceOptions);
  }
}
