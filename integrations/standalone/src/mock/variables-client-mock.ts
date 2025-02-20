import { VariablesClient } from '@axonivy/variable-editor';
import type { ConfigEditorActionArgs, MetaRequestTypes, VariablesData, VariablesValidationResult } from '@axonivy/variable-editor-protocol';
import { validations, variables } from './data';
import { knownVariables } from './meta';

export class VariablesClientMock extends VariablesClient {
  private variablesData: VariablesData = variables;

  override data(): Promise<VariablesData> {
    return Promise.resolve(variables);
  }

  override saveData(saveData: VariablesData): Promise<Array<VariablesValidationResult>> {
    this.variablesData.data = saveData.data;
    return Promise.resolve(validations);
  }

  override validate(): Promise<Array<VariablesValidationResult>> {
    return Promise.resolve(validations);
  }

  override meta<TMeta extends keyof MetaRequestTypes>(path: TMeta): Promise<MetaRequestTypes[TMeta][1]> {
    switch (path) {
      case 'variables/meta/knownVariables':
        return Promise.resolve(knownVariables);
      default:
        throw Error('mock meta path not programmed');
    }
  }

  override action(action: ConfigEditorActionArgs): void {
    console.log(`Action: ${JSON.stringify(action)}`);
  }
}
