import { expect, type Locator } from '@playwright/test';

export class Message {
  readonly locator: Locator;
  readonly reference: Locator;

  constructor(parent: Locator, id?: string) {
    if (id) {
      this.locator = parent.locator(`[id="${id}"]`);
    } else {
      this.locator = parent.locator('.ui-message');
    }
    this.reference = this.locator.getByRole('button');
  }

  async expectToBeHidden() {
    await expect(this.locator).toBeHidden();
  }

  async expectToBeInfo(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'info');
  }

  async expectToBeWarning(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'warning');
  }

  async expectToBeError(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'error');
  }

  async expectToHaveReference(tooltip: string) {
    await expect(this.reference).toBeVisible();
    await expect(this.reference.locator('i.ivy-exit-end')).toBeVisible();
    await this.reference.hover();
    await expect(this.locator.page().getByRole('tooltip')).toHaveText(tooltip);
  }
}
