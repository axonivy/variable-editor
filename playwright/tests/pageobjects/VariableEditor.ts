import { expect, type Locator, type Page } from '@playwright/test';
import { AddVariableDialog } from './AddVariableDialog';
import { Button } from './Button';
import { Details } from './Details';
import { OverwriteDialog } from './OverwriteDialog';
import { Table } from './Table';
import { TextArea } from './TextArea';
import { Toolbar } from './Toolbar';

export const server = process.env.BASE_URL ?? 'localhost:8080/~Developer-variables-test-project';
const ws = process.env.TEST_WS ?? '';
const app = process.env.TEST_APP ?? 'Developer-variables-test-project';
const pmv = 'variables-test-project';

export class VariableEditor {
  readonly page: Page;
  readonly toolbar: Toolbar;
  readonly search: TextArea;
  readonly tree: Table;
  readonly delete: Button;
  readonly add: AddVariableDialog;
  readonly locator: Locator;
  readonly details: Details;
  readonly masterPanel: Locator;
  readonly overwrite: OverwriteDialog;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator(':root');
    this.masterPanel = this.locator.locator('#variable-editor-main');
    this.toolbar = new Toolbar(page, this.masterPanel);
    this.search = new TextArea(this.locator);
    this.tree = new Table(page, this.locator, ['label', 'label'], { virtualized: true });
    this.delete = new Button(this.locator, { name: 'Delete variable' });
    this.add = new AddVariableDialog(page, this.locator);
    this.overwrite = new OverwriteDialog(page, this.locator);
    this.details = new Details(this.page, this.locator);
  }

  static async openEngine(page: Page, options?: { directSave?: boolean; readonly?: boolean }) {
    const serverUrl = server.replace(/^https?:\/\//, '');
    let url = `?server=${serverUrl}${ws}&app=${app}&pmv=${pmv}&file=config/variables.yaml`;
    if (options) {
      url += `${this.params(options)}`;
    }
    return this.openUrl(page, url);
  }

  static async openMock(page: Page, options?: { virtualize?: boolean; lng?: string }) {
    let url = 'mock.html';
    if (options) {
      url += '?';
      url += this.params(options);
    }
    return this.openUrl(page, url);
  }

  private static params(options: Record<string, string | boolean>) {
    let params = '';
    params += Object.entries(options)
      .map(([key, value]) => `&${key}=${value}`)
      .join('');
    return params;
  }

  private static async openUrl(page: Page, url: string) {
    await page.goto(url);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
    return new VariableEditor(page);
  }

  async takeScreenshot(fileName: string) {
    const dir = process.env.SCREENSHOT_DIR ?? 'tests/screenshots/target';
    const buffer = await this.page.screenshot({ path: `${dir}/screenshots/${fileName}`, animations: 'disabled' });
    expect(buffer.byteLength).toBeGreaterThan(3000);
  }

  async addVariable(name?: string, namespace?: string) {
    await this.add.open.click();
    if (name) {
      await this.add.name.fill(name);
    }
    if (namespace) {
      await this.add.namespace.fill(namespace);
    }
    await this.add.create.click();
  }
}
