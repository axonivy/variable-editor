import { useClient, type ConfigEditorActionArgs } from '@axonivy/variable-editor-protocol';
import { useAppContext } from './AppContext';

export function useAction(actionId: ConfigEditorActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: ConfigEditorActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
