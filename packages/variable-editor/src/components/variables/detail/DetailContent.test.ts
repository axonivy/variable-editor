import type { Client, KnownVariables, MetaRequestTypes, ValidationMessages } from '@axonivy/variable-editor-protocol';
import { waitFor } from '@testing-library/react';
import { customRenderHook } from '../data/test-utils/test-utils';
import { messageDataOfProperty, useOverwrites } from './DetailContent';

describe('useOverwrites', () => {
  test('variable that does not exist in required project returns false', () => {
    const view = customRenderHook(() => useOverwrites(['Variable']), {
      wrapperProps: { client: new ClientMock() }
    });
    expect(view.result.current).toBeFalsy();
  });

  test('variable located in existing folder of required project returns false', () => {
    const view = customRenderHook(() => useOverwrites(['Amazon', 'AmazonVariable']), {
      wrapperProps: { client: new ClientMock() }
    });
    expect(view.result.current).toBeFalsy();
  });

  test('variable that exists in required project returns true', async () => {
    const view = customRenderHook(() => useOverwrites(['Amazon', 'Comprehend', 'SecretKey']), {
      wrapperProps: { client: new ClientMock() }
    });
    await waitFor(() => {
      expect(view.result.current).toBeTruthy();
    });
  });

  test('variable that exists as folder in required project returns true', async () => {
    const view = customRenderHook(() => useOverwrites(['Amazon', 'Comprehend']), {
      wrapperProps: { client: new ClientMock() }
    });
    await waitFor(() => {
      expect(view.result.current).toBeTruthy();
    });
  });
});

class ClientMock implements Partial<Client> {
  meta<TMeta extends keyof MetaRequestTypes>(): Promise<MetaRequestTypes[TMeta][1]> {
    return Promise.resolve({
      children: [{ name: 'Amazon', children: [{ name: 'Comprehend', children: [{ name: 'SecretKey' }, { name: 'AccessKey' }] }] }]
    } as KnownVariables);
  }
}

test('messageDataOfProperty', () => {
  expect(messageDataOfProperty(validations, 'property0')).toEqual({ message: 'message0', variant: 'info' });
  expect(messageDataOfProperty(validations, 'property1')).toEqual({ message: 'message2', variant: 'warning' });
  expect(messageDataOfProperty(validations, 'property2')).toEqual({ message: 'message3', variant: 'error' });
  expect(messageDataOfProperty(validations, 'property3')).toBeUndefined();
});

const validations = [
  { message: 'message0', path: 'something.property0', severity: 'INFO' },
  { message: 'message1', path: 'something.else.property1', severity: 'INFO' },
  { message: 'message2', path: 'wow.property1', severity: 'WARNING' },
  { message: 'message3', path: 'wow.another.property2', severity: 'ERROR' },
  { message: 'message4', path: 'cool.property2', severity: 'INFO' }
] as ValidationMessages;
