import type { VariablesValidationResult } from '@axonivy/variable-editor-protocol';
import type { TreeNode, TreeNodeFactory, TreeNodeUpdate, TreeNodeUpdates } from '../../../utils/tree/types';
import type { Metadata } from './metadata';

export interface Variable extends TreeNode<Variable> {
  description: string;
  metadata: Metadata;
  validations?: Array<VariablesValidationResult>;
}
export const createVariable: TreeNodeFactory<Variable> = (name: string) => ({
  name: name,
  value: '',
  children: [],
  description: '',
  metadata: { type: '' }
});

export type VariableUpdate = TreeNodeUpdate<Variable>;
export type VariableUpdates = TreeNodeUpdates<Variable>;

export interface RootVariable extends Variable {
  commentAfter: string;
}
