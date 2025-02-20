import type {
  ConfigEditorActionArgs,
  KnownVariables,
  VariablesData,
  VariablesEditorDataContext,
  VariablesSaveDataArgs,
  VariablesValidationResult
} from '../editor';
import type { ClientJsonRpc } from './client-json-rpc';

export interface DataRequestTypes {
  'variables/data': [VariablesEditorDataContext, VariablesData];
}

export interface SaveDataRequestTypes {
  'variables/saveData': [VariablesSaveDataArgs & { directSave?: boolean }, Array<VariablesValidationResult>];
}

export interface ValidateRequestTypes {
  'variables/validate': [VariablesEditorDataContext, Array<VariablesValidationResult>];
}

export interface MetaRequestTypes {
  'variables/meta/knownVariables': [VariablesEditorDataContext, KnownVariables];
}

export const EMPTY_KNOWN_VARIABLES: KnownVariables = {
  children: [],
  description: '',
  metaData: { type: '' },
  name: '',
  namespace: '',
  value: ''
};

export interface RequestTypes extends DataRequestTypes, SaveDataRequestTypes, ValidateRequestTypes, MetaRequestTypes {}

export interface NotificationTypes {
  action: ConfigEditorActionArgs;
}

export interface ClientContext {
  client: ClientJsonRpc;
}
