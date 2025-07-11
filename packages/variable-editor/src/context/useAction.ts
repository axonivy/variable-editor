import type { VariablesActionArgs } from '@axonivy/variable-editor-protocol';
import { useClient } from '../protocol/ClientContextProvider';
import { useAppContext } from './AppContext';

export function useAction(actionId: VariablesActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: VariablesActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
