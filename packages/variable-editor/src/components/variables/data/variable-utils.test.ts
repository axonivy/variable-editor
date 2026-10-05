import { IvyIcons } from '@axonivy/ui-icons';
import type { KnownVariables } from '@axonivy/variable-editor-protocol';
import { content, contentStringsOnly, rootVariable } from './test-utils/variables';
import {
  contentEmpty,
  contentWithCommentOnly,
  contentWithEmptyValue,
  contentWithEmptyVariables,
  contentWithEmptyVariablesMapping,
  rootVariableEmpty,
  rootVariableParsedFromContentWithCommentOnly,
  rootVariableWithEmptyValue
} from './test-utils/variables-empty';
import { contentNotYAML, contentWithMultipleTopLevelNodes, contentWithWrongNameOfTopLevelNode } from './test-utils/variables-malformed';
import { contentMixed, rootVariableMixed } from './test-utils/variables-mixed';
import { contentWithComments, rootVariableWithComments } from './test-utils/variables-with-comments';
import { contentParsedFromRootVariableWithDuplicates, rootVariableWithDuplicates } from './test-utils/variables-with-duplicates';
import {
  contentWithMetadata,
  contentWithWeirdMetadataFormat,
  contentWithWrongMetadataFormat,
  rootVariableParsedFromContentWithWeirdMetadataFormat,
  rootVariableParsedFromContentWithWrongMetadataFormat,
  rootVariableWithMetadata
} from './test-utils/variables-with-metadata';
import type { Variable } from './variable';
import { nodeIcon, toContent, toVariables, variableIcon } from './variable-utils';

describe('toVariables', () => {
  test('default', () => {
    expect(toVariables(content)).toEqual(rootVariable);
  });

  test('comments', () => {
    expect(toVariables(contentWithComments)).toEqual(rootVariableWithComments);
  });

  describe('metadata', () => {
    test('default', () => {
      expect(toVariables(contentWithMetadata)).toEqual(rootVariableWithMetadata);
    });

    test('weirdFormat', () => {
      expect(toVariables(contentWithWeirdMetadataFormat)).toEqual(rootVariableParsedFromContentWithWeirdMetadataFormat);
    });

    test('wrongFormat', () => {
      expect(toVariables(contentWithWrongMetadataFormat)).toEqual(rootVariableParsedFromContentWithWrongMetadataFormat);
    });
  });

  test('mixed', () => {
    expect(toVariables(contentMixed)).toEqual(rootVariableMixed);
  });

  describe('empty', () => {
    test('empty', () => {
      expect(toVariables(contentEmpty)).toEqual(rootVariableEmpty);
    });

    test('emptyVariables', () => {
      expect(toVariables(contentWithEmptyVariables)).toEqual(rootVariableEmpty);
    });

    test('emptyVariablesMapping', () => {
      expect(toVariables(contentWithEmptyVariablesMapping)).toEqual(rootVariableEmpty);
    });

    test('commentOnly', () => {
      expect(toVariables(contentWithCommentOnly)).toEqual(rootVariableParsedFromContentWithCommentOnly);
    });

    test('emptyValue', () => {
      expect(toVariables(contentWithEmptyValue)).toEqual(rootVariableWithEmptyValue);
    });
  });

  describe('malformed', () => {
    test('wrongNameOfTopLevelNode', () => {
      expect(toVariables(contentWithWrongNameOfTopLevelNode)).toEqual(rootVariableEmpty);
    });

    test('multipleTopLevelNodes', () => {
      expect(toVariables(contentWithMultipleTopLevelNodes)).toEqual(rootVariableEmpty);
    });

    test('notYAML', () => {
      expect(toVariables(contentNotYAML)).toEqual(rootVariableEmpty);
    });
  });
});

describe('toContent', () => {
  test('default', () => {
    expect(toContent(rootVariable)).toEqual(contentStringsOnly);
  });

  test('comments', () => {
    expect(toContent(rootVariableWithComments)).toEqual(contentWithComments);
  });

  test('metadata', () => {
    expect(toContent(rootVariableWithMetadata)).toEqual(contentWithMetadata);
  });

  test('mixed', () => {
    expect(toContent(rootVariableMixed)).toEqual(contentMixed);
  });

  test('ignoreDuplicateKeys', () => {
    expect(toContent(rootVariableWithDuplicates)).toEqual(contentParsedFromRootVariableWithDuplicates);
  });

  test('empty', () => {
    expect(toContent(rootVariableEmpty)).toEqual(contentWithEmptyVariablesMapping);
  });
});

describe('variableIcon', () => {
  test('default', () => {
    const variable = { metadata: {}, children: [] as Array<Variable> } as Variable;
    expect(variableIcon(variable)).toEqual(IvyIcons.Quote);
  });

  test('mapping', () => {
    const variable = { metadata: { type: 'password' }, children: [{}] } as Variable;
    expect(variableIcon(variable)).toEqual(IvyIcons.FolderOpen);
  });

  test('password', () => {
    const variable = { metadata: { type: 'password' }, children: [] as Array<Variable> } as Variable;
    expect(variableIcon(variable)).toEqual(IvyIcons.Password);
  });

  test('daytime', () => {
    const variable = { metadata: { type: 'daytime' }, children: [] as Array<Variable> } as Variable;
    expect(variableIcon(variable)).toEqual(IvyIcons.CalendarTime);
  });

  test('enum', () => {
    const variable = { metadata: { type: 'enum' }, children: [] as Array<Variable> } as Variable;
    expect(variableIcon(variable)).toEqual(IvyIcons.List);
  });

  test('file', () => {
    const variable = { metadata: { type: 'file' }, children: [] as Array<Variable> } as Variable;
    expect(variableIcon(variable)).toEqual(IvyIcons.Note);
  });
});

describe('nodeIcon', () => {
  test('default', () => {
    const node = { metaData: { type: 'other' } } as KnownVariables;
    expect(nodeIcon(node)).toEqual(IvyIcons.Quote);
  });

  test('mapping', () => {
    const node = { metaData: { type: 'folder' } } as KnownVariables;
    expect(nodeIcon(node)).toEqual(IvyIcons.FolderOpen);
  });

  test('password', () => {
    const node = { metaData: { type: 'password' } } as KnownVariables;
    expect(nodeIcon(node)).toEqual(IvyIcons.Password);
  });

  test('daytime', () => {
    const node = { metaData: { type: 'daytime' } } as KnownVariables;
    expect(nodeIcon(node)).toEqual(IvyIcons.CalendarTime);
  });

  test('enum', () => {
    const node = { metaData: { type: 'enum' } } as KnownVariables;
    expect(nodeIcon(node)).toEqual(IvyIcons.List);
  });

  test('file', () => {
    const node = { metaData: { type: 'file' } } as KnownVariables;
    expect(nodeIcon(node)).toEqual(IvyIcons.Note);
  });
});
