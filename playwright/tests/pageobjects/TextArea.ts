import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { Message } from './Message';

export class TextArea {
  readonly parent: Locator;
  readonly locator: Locator;
  readonly showPassword: Locator;

  constructor(parent: Locator, options?: { label?: string; nth?: number }) {
    this.parent = parent;
    if (options?.label) {
      this.locator = parent.getByLabel(options.label, { exact: true });
    } else {
      this.locator = parent.getByRole('textbox').nth(options?.nth ?? 0);
    }
    this.showPassword = parent.getByLabel('Show password');
  }

  async fill(value: string) {
    await this.locator.fill(value);
  }

  async clear() {
    await this.locator.clear();
  }

  async expectValue(value: string) {
    await expect(this.locator).toHaveValue(value);
  }

  async expectEmpty() {
    await expect(this.locator).toBeEmpty();
  }

  async expectEnabled() {
    await expect(this.locator).toBeEnabled();
  }

  async expectDisabled() {
    await expect(this.locator).toBeDisabled();
  }

  async expectType(type: string) {
    await expect(this.locator).toHaveAttribute('type', type);
  }

  async expectNoType() {
    await expect(this.locator).not.toHaveAttribute('type');
  }

  async expectDoesNotExists() {
    await expect(this.locator).toHaveCount(0);
  }

  async message() {
    const describedBy = await this.locator.getAttribute('aria-describedby');
    if (!describedBy) {
      throw new Error('aria-describedby attribute is missing');
    }
    return new Message(this.parent, describedBy);
  }
}
