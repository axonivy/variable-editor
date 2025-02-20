import {
  ClientJsonRpc,
  type VariablesData,
  type VariablesEditorDataContext,
  type VariablesSaveDataArgs,
  type VariablesValidationResult
} from '@axonivy/variable-editor-protocol';

export class VariablesClient extends ClientJsonRpc {
  override data(context: VariablesEditorDataContext): Promise<VariablesData> {
    return this.sendRequest('variables/data', context);
  }

  override saveData(saveData: VariablesSaveDataArgs & { directSave?: boolean }): Promise<Array<VariablesValidationResult>> {
    return this.sendRequest('variables/saveData', saveData);
  }

  override validate(context: VariablesEditorDataContext): Promise<Array<VariablesValidationResult>> {
    return this.sendRequest('variables/validate', context);
  }
}
