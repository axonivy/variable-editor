import type { EnumMetadata, FileMetadata } from '../metadata';
import type { RootVariable } from '../variable';

export const contentWithMetadata = `Variables:
  # [password]
  passwordKey: passwordValue
  # [daytime]
  daytimeKey: 12:00
  # [enum: value0, value1, value2]
  enumKey: value1
  # [file: json]
  fileKey: fileValue
`;

export const rootVariableWithMetadata: RootVariable = {
  name: 'Variables',
  value: '',
  description: '',
  commentAfter: '',
  metadata: { type: '' },
  children: [
    {
      name: 'passwordKey',
      value: 'passwordValue',
      description: '',
      metadata: { type: 'password' },
      children: []
    },
    {
      name: 'daytimeKey',
      value: '12:00',
      description: '',
      metadata: { type: 'daytime' },
      children: []
    },
    {
      name: 'enumKey',
      value: 'value1',
      description: '',
      metadata: { type: 'enum', values: ['value0', 'value1', 'value2'] } as EnumMetadata,
      children: []
    },
    {
      name: 'fileKey',
      value: 'fileValue',
      description: '',
      metadata: { type: 'file', extension: 'json' } as FileMetadata,
      children: []
    }
  ]
};

export const contentWithWeirdMetadataFormat = `Variables:
  #   [password]   
  passwordKey: passwordValue
  # [enum:valueOne0,valueOne1,valueOne2]
  enumKeyOne: valueOne1
  #    [enum:   valueTwo0,   valueTwo1,   valueTwo2]   
  enumKeyTwo: valueTwo1
`;

export const rootVariableParsedFromContentWithWeirdMetadataFormat: RootVariable = {
  name: 'Variables',
  value: '',
  description: '',
  commentAfter: '',
  metadata: { type: '' },
  children: [
    {
      name: 'passwordKey',
      value: 'passwordValue',
      description: '',
      metadata: { type: 'password' },
      children: []
    },
    {
      name: 'enumKeyOne',
      value: 'valueOne1',
      description: '',
      metadata: { type: 'enum', values: ['valueOne0', 'valueOne1', 'valueOne2'] } as EnumMetadata,
      children: []
    },
    {
      name: 'enumKeyTwo',
      value: 'valueTwo1',
      description: '',
      metadata: { type: 'enum', values: ['valueTwo0', 'valueTwo1', 'valueTwo2'] } as EnumMetadata,
      children: []
    }
  ]
};

export const contentWithWrongMetadataFormat = `Variables:
  # [ password ]
  passwordKey: passwordValue
`;

export const rootVariableParsedFromContentWithWrongMetadataFormat: RootVariable = {
  name: 'Variables',
  value: '',
  description: '',
  commentAfter: '',
  metadata: { type: '' },
  children: [
    {
      name: 'passwordKey',
      value: 'passwordValue',
      description: '',
      metadata: { type: '' },
      children: []
    }
  ]
};
